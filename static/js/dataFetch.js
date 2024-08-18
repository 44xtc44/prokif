// dataFetch.js
"use strict";

// https://dmitripavlutin.com/javascript-fetch-async-await/
// "https://api.energy-charts.info/public_power?country=fr&start=2023-01-01&end=2023-12-31"

/**
 * Menu bar full download. Async.
 */
function pullStoreJson() {
  const parentId = "divDownloadReport";
  const year = eStore.year;
  const useProxy = document.getElementById("useProxy").dataset.value;
  Object.keys(year).map((yNum) => {
    Object.keys(countryCodes).forEach((country) => {
      getApiData({
        useProxy: useProxy,
        country: country,
        year: year,
        yNum: yNum,
        parentId: parentId,
      });
    });
  });
}

/**
 * Pull via proxy, node.js npm packet. Then,
 * POST the URL string to the node.js express proxy.
 * Pull via Browser exension. Then,
 * GET request directly to API.
 * @param {Object} options options = {}
 * @param {boolean} options.useProxy true or false
 * @param {string} options.country for JSON data set
 * @param {string} options.yNum date data set
 * @param {Object} options.year dict with strings of years
 * @param {string} options.parentId div elem to attach log div
 */
function getApiData(options = {}) {
  const o = options;
  const useProxy = o.useProxy;
  const urlObj = {
    country: o.country,
    yNum: o.yNum,
    year: o.year,
    parentId: o.parentId,
    start: o.year[o.yNum] + dateForm.yearStart,
    end: o.year[o.yNum] + dateForm.yearEnd,
    url: fraunhoferApi,
    endPoint: frauEP.PublicPower,
  };
  let askUrl = getData(urlObj);
  if (useProxy === "true") askUrl = postData(urlObj);
  askUrl
    .then((data) => {
      if (data === undefined)
        throw " No data. ".concat(countryCodes[urlObj.country]);
      return prepIndexedDbStorage({
        country: urlObj.country,
        start: urlObj.start,
        data: data,
      });
    })
    .then((bubbleObj) => {
      return adaptDataColHeader(bubbleObj);
    })
    .then((bubbleObj) => {
      updateIndexDbCountry(bubbleObj);
      appendDiv({
        parentId: document.getElementById(urlObj.parentId),
        childId: "report_".concat(urlObj.country, urlObj.yNum),
        innerText: "OK_".concat(countryCodes[urlObj.country], " ", urlObj.yNum),
        elemClass: "dlReport",
      });
      return bubbleObj;
    })
    .catch(() => {
      appendDiv({
        parentId: document.getElementById(urlObj.parentId),
        childId: "report_".concat(urlObj.country, urlObj.yNum),
        innerText: "Fail_".concat(
          countryCodes[urlObj.country],
          " ",
          urlObj.yNum
        ),
        elemClass: "dlReport",
      });
    });
}

/**
 * GET request via Browser
 * to get JSON from Fraunhofer Institut.
 * @param {string} options.start date data set
 * @param {string} options.end date data set
 * @param {string} options.url for JSON data set
 * @param {string} options.endPoint API for JSON data set
 * @param {string} options.country for JSON data set
 * @returns {JSON} if ok, undefined if fail
 */
async function getData(options = {}) {
  const response = await fetch(
    options.url.concat(
      options.endPoint,
      "?country=",
      options.country,
      "&start=",
      options.start,
      "&end=",
      options.end
    ),
    {
      method: "GET",
      mode: "cors",
    }
  );
  if (response.ok) {
    const data = await response.json();
    if (data !== undefined && data !== null) return data; // fun must ask for data: .then
  }
}

/**
 * POST request to local proxy express server.
 * Browser to Node.js express server proxy -> 3rd party API, back.
 * @param {string} options.start date data set
 * @param {string} options.end date data set
 * @param {string} options.url for JSON data set
 * @param {string} options.endPoint API for JSON data set
 * @param {string} options.country for JSON data set
 * @returns {{Object}} with JSON and custom meta data to store it in IndexedDB
 */
async function postData(options = {}) {
  const country = options.country;
  const year = options.start.substring(0, 4);
  try {
    const url = options.url.concat(
      options.endPoint,
      "?country=",
      options.country,
      "&start=",
      options.start,
      "&end=",
      options.end
    );
    const response = await fetch("/fraunhofer/api", {
      method: "POST",
      body: JSON.stringify({ url: url, year: year, countryCode: country }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      throw "No data for ".concat(countryCodes[options.country], " ", year); // catch
    return await response.json();
  } catch (error) {
    throw new Error(error); // jump to exit .catch()
  }
}

/**
 * Construct the object for IndexDb feed.
 * @param {string} options.country country code
 * @param {string} options.start start date in DB
 * @param {string} options.data JSON data from API
 * @returns {Object} JSON data and meta data
 */
function prepIndexedDbStorage(options = {}) {
  return {
    objectStoreName: "production_types",
    country: options.country, // idb db name
    year: options.start.substring(0, 4), // objStore key name
    json: options.data, // JSON response object
  };
}

/**
 * Adapt the API data to browser IndexedDb column names.
 * @param {Object} bubbleObj JSON and meta data
 * @returns {Object} JSON data and meta data
 */
function adaptDataColHeader(bubbleObj) {
  // get rid of obj.name and obj.data key names (original db table col remnants)
  const prodTypes = bubbleObj.json.production_types.reduce((acc, type) => {
    // {Biomass: [1,2,3], Hydro: [1,2,3], Fossil_gas:...}
    // IndexedDB of browser is a spoiled princess, empty or hyphen or forward slash, indecies pb
    acc[type.name.replace(/ /g, "_").replace(/-/g, "_").replace(/\//g, "_")] =
      type.data;
    return acc;
  }, {});
  bubbleObj.prodTypes = prodTypes;
  return bubbleObj;
}

/**
 * Update the country IndexedDb.
 * @param {Object} bubbleObj JSON and meta data
 */
function updateIndexDbCountry(bubbleObj) {
  const keyDataSet = Object.assign({}, bubbleObj.prodTypes);
  keyDataSet.id = bubbleObj.year; // db key
  keyDataSet.unix_seconds = bubbleObj.json.unix_seconds; // add time array time[0] and Biomass[0]

  setIdbValue({
    // db transaction
    dbName: bubbleObj.country,
    dbVersion: 1,
    objectStoreName: bubbleObj.objectStoreName,
    data: keyDataSet,
    id: keyDataSet.id, // keyDataSet.id is year (2015), is row id
  });
}

module.exports = { getData }; // export for jest tests
