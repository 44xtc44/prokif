// selectRun.js
"use strict";

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

  // console.log("dataobj->",countryCodes[countryCode], year, dataobj)

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
 * Request the DB data via browser, as extension.
 * So no CORS problems here. NodeJS will suffer from CORS.
 * @param {*} options
 * @returns
 */
function pickDataSet(options = {}) {
  console.log("pickDataSet->");
  // pull data set and store it in closure, cache 'dataCall.set'.
  const yesterday = getYesterday();
  const yDay = yesterday.day;
  const yMonth = yesterday.month;
  const thisYear = new Date().getFullYear();
  const cCode = options.cCode;
  const yNum = options.year;
  const start = yNum + dateForm.yearStart;
  let endDate = yNum + dateForm.yearEnd;

  if (thisYear == yNum) endDate = yNum + "-" + yMonth + "-" + yDay; // "-12-31"

  return new Promise((resolve, reject) => {
    getIdbValue({
      // GET possible not necessary, only if?
      // get data local if available
      dbName: cCode,
      dbVersion: 1,
      objectStoreName: "production_types",
      id: yNum,
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
        getData({
          country: cCode,
          start: start,
          end: endDate,
          url: fraunhoferApi,
          endPoint: frauEP.PublicPower,
        })
          .then((bubbleObj) => {
            const restructBubbleObj = restructData(bubbleObj);
            return restructBubbleObj;
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

function pickDataSetAsPackage(options = {}) {
  // npm package
  const yesterday = getYesterday();
  const yDay = yesterday.day;
  const yMonth = yesterday.month;
  const thisYear = new Date().getFullYear();
  const cCode = options.cCode;
  const yNum = options.year;
  const start = yNum + dateForm.yearStart;
  let endDate = yNum + dateForm.yearEnd;

  if (thisYear == yNum) endDate = yNum + "-" + yMonth + "-" + yDay; // "-12-31"

  return new Promise((resolve, reject) => {
    getIdbValue({
      dbName: cCode,
      dbVersion: 1,
      objectStoreName: "production_types",
      id: yNum,
      callback: (data) => dataCall.set(data, cCode, yNum),
    })
      .then(() => {
        const forceRemote = document.getElementById(cCode + "::" + yNum).dataset
          .value;
        if (thisYear == yNum && forceRemote === "true")
          throw "force update data";
        // data already in local store
        runShow({ cCode: cCode, year: yNum });
        resolve(true);
      })
      .catch(() => {
        // data not local avail., -> go to proxy (express server that called index.html)
        postData({
          country: cCode,
          start: start,
          end: endDate,
          url: fraunhoferApi,
          endPoint: frauEP.PublicPower,
        })
          .then((bubbleObj) => {
            const restructBubbleObj = restructData(bubbleObj);
            return restructBubbleObj;
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
