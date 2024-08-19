// selectRun.js
"use strict";

/**
 * Create country instance and adjust it onto the
 * user selected options.
 * @param {Object} options options = {}
 * @param {string} options.cCode two char country code
 * @param {number} options.year of the data set in DB
 */
function runShow(options = {}) {
  const spanHourly = document.getElementById("spanHourly");
  const isIdxHourly = spanHourly.dataset.value;

  const countryCode = options.cCode;
  const year = options.year;

  const dataobj = createTrinityFromClosure({
    countryCode: countryCode,
    year: year,
    call: () => dataCall.get(),
  });

  frameControl[countryCode + year] = {};
  frameControl[countryCode + year]["idxStep"] = 1; // germany has 4 updates per hour
  frameControl[countryCode + year]["fps"] = 30; // currently overwritten in animationframe

  frameControl[countryCode + year]["instance"] = new EnergyMix({
    prodCountry: countryCode,
    prodYear: year,
    cData: dataobj.cData, // dataset of country, year
    noCO2: dataobj.trinity.noCO2, // grouped arrays
    lowCO2: dataobj.trinity.lowCO2,
    isCO2: dataobj.trinity.isCO2,
    unix_seconds: dataobj.timestamps.unix_seconds,
    clockwise: false,
    ctx: eStore.antiClockCtx,
    triangleName: "ternaryPlotAntiClock",
    trianglePoints: eStore.triangleResize, // pull current triangle data
  });
  buildManualSliderFromMax();
  if (isIdxHourly === "true") {
    // skip idx steps if dataset has minutes set
    const step = getIndexStepHourly({
      instance: frameControl[countryCode + year].instance,
    });
    frameControl[countryCode + year].idxStep = step;
  }
}

/**
 * Checks our local DB if data already exists.
 * GET request the Fraunhofer API data via browser, as extension.
 * POST request the local express API data, as node.js package.
 * @param {Object} options options = {}
 * @param {string} options.cCode country code
 * @param {number} options.year of data set
 * @param {boolean} options.useProxy node.js express
 * @returns {Promise} true or false if failed
 */
function pickDataSet(options = {}) {
  const yesterday = getYesterday();
  const yDay = yesterday.day;
  const yMonth = yesterday.month;
  const thisYear = new Date().getFullYear();
  const cCode = options.cCode;
  const yNum = options.year;
  const start = yNum + dateForm.yearStart;
  let endDate = yNum + dateForm.yearEnd;

  const useProxy = options.useProxy;
  const urlObj = {
    country: cCode,
    start: start,
    end: endDate,
    url: fraunhoferApi,
    endPoint: frauEP.PublicPower,
  };
  if (thisYear == yNum) endDate = yNum + "-" + yMonth + "-" + yDay; // "-12-31"

  return new Promise((resolve, reject) => {
    getIdbValue({
      dbName: cCode,
      dbVersion: 1,
      objectStoreName: "production_types",
      id: yNum,
      // pull data set and store it in closure, cache 'dataCall.set'.
      callback: (data) => dataCall.set(data, cCode, yNum),
    })
      .then(() => {
        // data local ok, but check if user want newest data from remote
        const forceRemote = document.getElementById(cCode + "::" + yNum).dataset
          .value;
        if (thisYear == yNum && forceRemote === "true")
          throw "force update data"; // jump to .catch
        // else data in local store is fine
        runShow({ cCode: cCode, year: yNum });
        resolve(true);
      })
      .catch(() => {
        // data not in local store yet
        let askUrl = getData(urlObj);
        if (useProxy === "true") askUrl = postData(urlObj);
        askUrl
          .then((data) => {
            if (data === undefined) throw " No data. ".concat(countryCodes[country])
            return prepIndexedDbStorage({
              country: cCode,
              start: start,
              data: data,
            });
          })
          .then((bubbleObj) => {
            return adaptDataColHeader(bubbleObj);
          })
          .then((bubbleObj) => {
            updateIndexDbCountry(bubbleObj);
            return bubbleObj;
          })
          .then(() => {
            getIdbValue({
              dbName: cCode,
              dbVersion: 1,
              objectStoreName: "production_types",
              id: yNum,
              callback: (data) => dataCall.set(data, cCode, yNum),
            }).then(() => {
              runShow({ cCode: cCode, year: yNum });
              resolve(true);
            });
          })
          .catch((error) => {
            console.log(error);
            reject(false);
          });
      });
  });
}

/**
 * Provide each instance with index step to sync if demanded.
 * How many steps to skip to get only full hours displayed.
 * If countryA got full hours and countryB 0,15,30,45 quarters.
 * Find first data set with 0, count next as long not 0 again.
 * @param {Object} options options = {}
 * @param {instance} options.instance country instance
 * @returns {number} of index steps to next data set to read
 */
function getIndexStepHourly(options = {}) {
  const inst = options.instance;
  let count = 0;
  let idxStep = 0;

  inst.unixSeconds.slice(0).map((timestamp, _, array) => {
    const isoDate = getDateParts(timestamp);
    const isoMinute = Math.floor(isoDate.minute); // get int
    if (isoMinute === 0 && count > 0) {
      array.splice(1); // del sliced array copy; map() runs till end of []
      idxStep = count;
    }
    if (isoMinute === 0 && count === 0) count = 1; // found full
    if (isoMinute > 0) count += 1;
  });
  return idxStep;
}