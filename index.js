#!/usr/bin/env node

/**
 * NPM package local express HTTP server to run the page on every browser.
 * 
 * The above string is used by the npm executable. Else strange errors.
 * JS can not go directly to the Fraunhofer site, like in
 * FireFox browser extension; CORS thingy.
 * JS reads a proxy value from div element (on its page) and if 'true' it must send
 * the connection url as string (to this module), to get the JSON DB file.
 * Proxy fun (this module) will return server response JSON DB file or error message (to page JS).
 * index.html and addon.html have only one difference.
 * The browser extension "addon.html" version uses 'false' for useProxy.
 * <div id="useProxy" data-value="false"></div>
 */
const PORT = 8001; // can use any port
const cst = require("./static/js/constants");
const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const cors = require("cors");
const { open } = require("out-url"); // Opens the URL in the default browser.
const publicPath = path.join(__dirname, "static");

app.use(cors());
// enable middleware to parse body of Content-type: application/json
app.use(express.json());
app.use(express.static(publicPath)); // runs index.html in folder

app.post("/fraunhofer/api", (req, res) => {
  const url = req.body.url;
  const year = req.body.year;
  const countryCode = req.body.countryCode;
  const waitData = getData({ url: url, year: year, countryCode: countryCode });
  waitData.then((data) => res.send({ data: data }));
  console.log("url: ", cst.countryCodes[countryCode], year, url);
});

app.listen(PORT);
console.log("server on " + PORT);
open("http://localhost:" + PORT);

/**
 * Proxy server for npm package.
 * Browser can not download data itself if page was
 * loaded by us.
 * @param options.url string url Fraunhofer Institut API
 * @param options.year string requested year
 * @param options.countryCode string two char code for country
 * @returns JSON DB data object
 */
async function getData(options = {}) {
  try {
    const response = await fetch(options.url);
    if (!response.ok) throw "No data for ".concat(options.url); // catch
    const str = await response.text();
    const data = await JSON.parse(str);
    return data;
  } catch (error) {
    console.error(
      "->error ",
      cst.countryCodes[options.countryCode],
      options.year,
      error
    );
    return error;
  }
}
