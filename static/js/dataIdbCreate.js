// dataIdbCreate.js
"use strict";

// THE MANUAL, also cover upgrade the db https://javascript.info/indexeddb
// JSON in out, https://www.scriptol.com/javascript/indexedDB-JSON.php

/**
 * Init a named DB.
 * Read the version number of db.
 * Read all object stores of db.
 * Have an option to create a new and delete an object store.
 * Update the version number of schema.
 * Use always 'put' and not 'add' to init the fields. Save head aches.
 * Use 'autoincrement' over 'keypath'. Get a date from JSON response anyway.
 */

/**
 * Create the objectStore and DB indicies for a named database.
 * Also a template for the upgrade fun.
 * Go 'DBOpenRequest.onsuccess' not 'DBOpenRequest.onupgradeneeded'.
 * @param {} options
 * @returns
 */
function initIndexDb(options = {}) {
  // Promise to schedule app state update fun.
  let db = null;
  let transaction = null;
  return new Promise((resolve, reject) => {
    let DBOpenRequest = window.indexedDB.open(
      options.dbName,
      options.dbVersion
    );
    DBOpenRequest.onerror = (event) => {
      reject(event.target.error);
    };
    DBOpenRequest.onsuccess = () => {
      // Init should do nothing if landing here!
      db = DBOpenRequest.result;
      // read, write or return a msg
      resolve(true);
    };
    DBOpenRequest.onupgradeneeded = (event) => {
      let result = event.target.result;
      result.onerror = (event) => console.error(event.target.error);

      const createObjectStore = result.createObjectStore(
        options.objectStoreName,
        {
          keyPath: options.primaryKey, // 2022:"{"id":"2022","unix_seconds":[1,2,3],"Nuclear":["Nuke","duke","puke"],"
        }
      );

      for (const keyValPair of Object.entries(options.indexNames)) {
        // for(... of); .map refuses to iter dict
        const key = keyValPair[0];
        const multiEntry = keyValPair[1];
        createObjectStore.createIndex(key.concat("_idx"), key, multiEntry);
      }
      resolve(true);
    };
  });
}

function createCountryDB() {
  initIndexDb({
    // LOG DB
    dbName: "country_fetched",
    dbVersion: 1,
    objectStoreName: "production_types",
    primaryKey: "id", // 2015 (year)
    indexNames: { id: { unique: true } },
  });

  Object.keys(countryCodes).forEach((country) => {
    const deps = {
      country: country,
      objectStoreName: "production_types",
    };
    initIndexDb({
      // create db and/or objectStores; no transaction
      dbName: country,
      dbVersion: 1,
      objectStoreName: "production_types",
      primaryKey: "id", // 2015 (year)
      indexNames: { id: { unique: true } },
    });
  });
}

function createUserSettingsDB() {
  const dbName = "prokif_user_settings";
  const dbVersion = 1;
  const objectStoreName = "state";
  const primaryKey = "id"; // index name, yep has a name
  const firstRowName = "user_settings";
  const setDefault = {
    id: firstRowName,
    sliderFps: "30",
    autoButton: true,
    hoursButton: true,
    syncButton: true,
    tradeButton: false,
  };
  const indexNames = Object.keys(setDefault).reduce((accu, val) => {
    accu[val] = { unique: true }; // { sliderFps: { unique: true }},
    return accu;
  }, {});

  const createDb = async () => {
    await initIndexDb({
      // creates if not exists
      dbName: dbName,
      dbVersion: dbVersion,
      objectStoreName: objectStoreName,
      primaryKey: primaryKey,
      indexNames: indexNames,
    });
  };
  createDb().then(() => {
    getIdbValue({
      dbName: dbName,
      dbVersion: dbVersion,
      objectStoreName: objectStoreName,
      id: firstRowName,
    })
      .then((dataResult) => restoreUserSettings(dataResult))
      .catch(() => {
        // no data yet
        setIdbValue({
          dbName: dbName,
          dbVersion: dbVersion,
          objectStoreName: objectStoreName,
          id: firstRowName,
          data: setDefault, // data row incl. row name {id: foo, set1: true}
        });
      });
  });
}