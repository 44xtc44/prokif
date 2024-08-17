// dataFetch.getData.spy
"use strict";

const mod = require("../static/js/dataFetch");
// This is GLOBAL, means changing something later in this module will have side effects.
const fetchMockJson = jest
  .spyOn(global, "fetch")
  .mockImplementation(() =>
    Promise.resolve({ json: () => Promise.resolve(undefined) })
  );

describe("Spy fetch mock, Browser connect to API via getData.", () => {
  const start = "2016-01-01";
  const end = "2016-12-31";
  const country = "ch";
  const endPoint = "/public_power";
  const fraunhoferApi = "https://api.energy-charts.info";

  test("Valid URL string.", async () => {
    const json = mod.getData({
      country: country,
      start: start,
      end: end,
      url: fraunhoferApi,
      endPoint: endPoint,
    });
    expect(fetchMockJson).toHaveBeenCalledWith(
      "https://api.energy-charts.info/public_power?country=ch&start=2016-01-01&end=2016-12-31",
      { method: "GET", mode: "cors" }
    );
    expect(json.length).toEqual(undefined);
  });
});
