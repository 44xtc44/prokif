// dataFetch.getData.global
"use strict";

const mod = require("../static/js/dataFetch");
/* 
country: "ch"
end: "2016-12-31"
endPoint: "/public_power"
start: "2016-01-01"
url: "https://api.energy-charts.info"
*/

// const mockFetch = Promise.resolve({ json: () => Promise.resolve(accepted) });
// global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

// This is the section where we mock `fetch`
const unmockedFetch = global.fetch;



// This is actual testing suite
describe("Global fetch mock, Browser connect to API via getData.", () => {
  beforeAll(() => {
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve(undefined), // no data res.json() is undefined
      });


  });
  
  afterAll(() => {
    // cleanup global
    global.fetch = unmockedFetch;
  });
  const fraunhoferApi = "https://api.energy-charts.info";
  const endPoint = "/public_power";

  test("works", async () => {
    const json = mod.getData({
      country: "ch",
      start: "2016-01-01",
      end: "2016-12-31",
      url: fraunhoferApi,
      endPoint: endPoint,
    });
    expect(json.length).toEqual(undefined);
  });
});
