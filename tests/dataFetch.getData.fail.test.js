// dataFetch.getData.fail
"use strict";

const mod = require("../static/js/dataFetch");

describe("Spy fetch mock, Browser connect to API via getData.", () => {
  const start = "2016-01-01";
  const end = "2016-12-31";
  const country = "ch";
  const endPoint = "/public_power";
  const fraunhoferApi = "https://api.energy-charts.info";

  const fetchMockJson = jest
  .spyOn(global, "fetch")
  .mockImplementation(() =>
    Promise.reject(false)  // network error, dataset not found
  );

  test("No data, returns false.", async () => {
    const json = await mod.getData({  
      country: country,
      start: start,
      end: end,
      url: fraunhoferApi,
      endPoint: endPoint,
    }).catch(() => {});  // caller handles reject
    expect(fetchMockJson).toHaveBeenCalledWith(
      "https://api.energy-charts.info/public_power?country=ch&start=2016-01-01&end=2016-12-31",
      { method: "GET", mode: "cors" }
    );
    expect(json).toBeFalsy;
  });
});