// dataFetch.getData.fetch-mock
"use strict";

require("jest-fetch-mock").enableMocks(); // first to stay
const mod = require("../static/js/dataFetch");

describe("API success tests.", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  const start = "2016-01-01";
  const end = "2016-12-31";
  const country = "ch";
  const endPoint = "/public_power";
  const fraunhoferApi = "https://api.energy-charts.info";

  it("OK JSON data.", () => {
    fetch.mockResponseOnce(JSON.stringify({ data: "12345" }));
    //assert on the response
    mod
      .getData({
        country: country,
        start: start,
        end: end,
        url: fraunhoferApi,
        endPoint: endPoint,
      })
      .then((response) => {
        expect(response.data).toEqual("12345");
      });
    //assert on the times called
    expect(fetch.mock.calls.length).toEqual(1);
    // and arguments given to fetch [ [], [] ]
    expect(fetch.mock.calls[0][0]).toEqual(
      "https://api.energy-charts.info/public_power?country=ch&start=2016-01-01&end=2016-12-31",
      { method: "GET", mode: "cors" }
    );
  });
});