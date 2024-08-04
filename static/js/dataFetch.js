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
  Object.keys(year).map((yNum) => {
    Object.keys(countryCodes).forEach((country) => {
      const useProxy = document.getElementById("useProxy").dataset.value;
      console.log("useProxy->", useProxy)
      if (useProxy === "true") {
        getDataFromProxy({
          country: country,
          year: year,
          yNum: yNum,
          parentId: parentId,
        });
      } else {
        getDataNoProxy({
          country: country,
          year: year,
          yNum: yNum,
          parentId: parentId,
        });
      }
    });
  });
}

function getDataFromProxy(options = {}) {
  const country = options.country;
  const yNum = options.yNum;
  const year = options.year;
  const parentId = options.parentId;
  postData({
    country: country, 
    start: year[yNum] + dateForm.yearStart,
    end: year[yNum] + dateForm.yearEnd,
    url: fraunhoferApi,
    endPoint: frauEP.PublicPower,
  })
    .then((bubbleObj) => {
      const restructBubbleObj = restructData(bubbleObj);
      return restructBubbleObj;
    })
    .then((bubbleObj) => {
      updateIndexDbCountry(bubbleObj);
      appendDiv({
        parentId: document.getElementById(parentId),
        childId: "report_".concat(country, yNum),
        innerText: "OK_".concat(countryCodes[country], " ", yNum),
        elemClass: "dlReport",
      });
      return bubbleObj;
    })
    .catch((error) => {
      appendDiv({
        parentId: document.getElementById(parentId),
        childId: "report_".concat(country, yNum),
        innerText: "Fail_".concat(countryCodes[country], " ", yNum),
        elemClass: "dlReport",
      });
    });
}

function getDataNoProxy(options = {}) {
  const country = options.country;
  const yNum = options.yNum;
  const year = options.year;
  const parentId = options.parentId;
  getData({
    country: country,
    start: year[yNum] + dateForm.yearStart,
    end: year[yNum] + dateForm.yearEnd,
    url: fraunhoferApi,
    endPoint: frauEP.PublicPower,
  })
    .then((bubbleObj) => {
      const restructBubbleObj = restructData(bubbleObj);
      return restructBubbleObj;
    })
    .then((bubbleObj) => {
      updateIndexDbCountry(bubbleObj);
      appendDiv({
        parentId: document.getElementById(parentId),
        childId: "report_".concat(country, yNum),
        innerText: "OK_".concat(countryCodes[country], " ", yNum),
        elemClass: "dlReport",
      });
      return bubbleObj;
    })
    .catch((error) => {
      appendDiv({
        parentId: document.getElementById(parentId),
        childId: "report_".concat(country, yNum),
        innerText: "Fail_".concat(country, yNum, error),
        elemClass: "dlReport",
      });
    });
}

async function getData(options = {}) {
  const country = options.country;
  const year = options.start.substring(0, 4);
  // bubble up var vals to all promise .then()
  const bubbleObj = {
    objectStoreName: "production_types",
    country: country, // later idb db name
    year: year, // objStore key name
    json: "", // JSON response string
  };

  try {
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
        mode: "cors", // npm package needs proxy in manifest or package.json, check!
      }
    );

    if (!response.ok)
      throw "No data for ".concat(countryCodes[options.country], " ", year); // catch
    const str = await response.text();
    const data = await JSON.parse(str);
    bubbleObj.json = data;
    return bubbleObj;
  } catch (error) {
    throw new Error(error); // jump to exit .catch()
  }
}

/**
 * Node.js express server POST request to get JSON from Fraunhofer Institut.
 * @param {*} options
 * @returns
 */
async function postData(options = {}) {
  const country = options.country;
  const year = options.start.substring(0, 4);
  // bubble up var vals to all promise .then()
  const bubbleObj = {
    objectStoreName: "production_types",
    country: country, // later idb db name
    year: year, // objStore key name
    json: "", // JSON response string
  };

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

    const str = await response.text();
    const data = await JSON.parse(str);
    bubbleObj.json = data.data;

    console.log("dataFetch->", data.data);
    return bubbleObj;
  } catch (error) {
    throw new Error(error); // jump to exit .catch()
  }
}

function restructData(bubbleObj) {
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
    id: keyDataSet.id  // keyDataSet.id is year (2015), is row id
  });
}
