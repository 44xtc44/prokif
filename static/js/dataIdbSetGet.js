// dataIdbSetGet.js
"use strict";

var testLen = 0;
/**
 * KeyPath based ('id').
 * @param options.dbName  dbName
 * @param options.dbVersion dbVersion
 * @param options.objectStoreName objectStoreName
 * @param options.data dictionary with data row to update, whole row
 * @param options.updFields dictionary with data, selective update fields
 * @returns {Promise.resolve, Promise.reject}
 * @example
 * setIdbValue({
 *   // db transaction, update if country is done
 *   dbName: bubbleObj.logDbFetched,
 *   dbVersion: 1,
 *   objectStoreName: bubbleObj.objectStoreName,
 *   data: {
 *     id: bubbleObj.year,
 *     country: [...result.country, bubbleObj.country],
 *   },
 * });
 * setIdbValue({
*    dbName: "prokif_user_settings",
*    dbVersion: 1,
*    objectStoreName: "state",
*    id: "user_settings",
*    updFields: { sliderFps: sliderFps.value },
*  });
 */
function setIdbValue(options = {}) {
  const updFields = options.updFields; // may contain one or more fields
  return new Promise((resolve, reject) => {
    const conOpen = window.indexedDB.open(options.dbName, options.dbVersion);
    conOpen.onerror = (event) => reject(event.target.error);
    conOpen.onsuccess = () => {
      const db = conOpen.result;
      const transact = db.transaction(options.objectStoreName, "readwrite");
      const store = transact.objectStore(options.objectStoreName);
      const data = store.get(options.id);

      data.onsuccess = () => {
        let dataRow = data.result;
        if (updFields !== undefined) {
          let dataClone = dataRow; // {id:equalizer,power:true,band:3,...}
          let updKeyList = Object.keys(updFields); // list of keys [power,band]
          for (let key of updKeyList) {
            dataClone[key] = updFields[key]; // upd val
          }
          store.put(dataClone);
          return;
        }
        
        // objectStore has keys defined internal but shows no data, store just created
        if (dataRow === undefined) dataRow = {};
        for (const keyValPair of Object.entries(options.data)) {
          // list of keys, fun({data: foo:[bar,buz]})
          dataRow[keyValPair[0]] = keyValPair[1]; // upd val
        }
        const size = new TextEncoder().encode(JSON.stringify(dataRow)).length;
        const kiloBytes = size / 1024;
        const megaBytes = kiloBytes / 1024;
        testLen += megaBytes;
        console.log("write-> MB, db.name, row.id", testLen.toFixed(2), options.dbName, dataRow.id);
        store.put(dataRow);
        resolve(true);
      };
      data.onerror = (event) => {
        reject(event.target.error);
      };
    };
  });
}

/**
 * Get the data row with a given 'id'.
 * @param options.dbName  dbName
 * @param options.dbVersion dbVersion
 * @param options.objectStoreName objectStoreName
 * @param options.id primary key for a paricular row, i.e. "2022"
 * @param options.callback fun to transport value out of promise
 * @returns {Promise.resolve(data)} .then((data) => ...) data{id:2022,power:true,band:3,...}
 * @example
 * getIdbValue({
 *  dbName: "de",
 *  dbVersion: 1,
 *  objectStoreName: "production_types",
 *  id: "2023",
 *  callback: (data) => dataCall.set(data, "de", "2023"),
 * });
 */
function getIdbValue(options = {}) {
  return new Promise((resolve, reject) => {
    const conOpen = window.indexedDB.open(options.dbName, options.dbVersion);
    conOpen.onerror = (event) => reject(event.target.error);

    conOpen.onsuccess = () => {
      const db = conOpen.result;
      const transact = db.transaction(options.objectStoreName);
      const store = transact.objectStore(options.objectStoreName);
      const data = store.get(options.id); // get()
      data.onsuccess = () => {
        const dataResult = data.result;
        if (dataResult === undefined) reject(); // store exists but no data in row
        if (options.callback !== undefined) options.callback(dataResult);
        resolve(dataResult);
      };
      data.onerror = (event) => {
        reject(event.target.error);
      };
    };
  });
}
