// https://dev.to/dstrekelj/how-to-test-classes-with-jest-jif
// https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs
// "test": "jest --watchAll" hangs GitHub actions

const mod = require("../static/js/dataTernaryPlotCalc");
// prodTypeValues

describe("Production types accumulated for one trinary item.", () => {
  const prodTypes = {
    sun: [1, 5, NaN, null, undefined],
    wind_onshore: [2, 5, 5, 5, 5],
    wind_offshore: [3, 5, 5, 5, 5],
  };

  test("Sum all dict members at index 0 and get 6.", () => {
    expect(mod.prodTypeValues({ prodType: prodTypes, idx: 0 })).toBe(6);
  });
  test("Sum all dict members at index 1 and get 15.", () => {
    expect(mod.prodTypeValues({ prodType: prodTypes, idx: 1 })).toBe(15);
  });
  test("Sum all dict members at index 2 and get 10. NaN value.", () => {
    expect(mod.prodTypeValues({ prodType: prodTypes, idx: 2 })).toBe(10);
  });
  test("Sum all dict members at index 3 and get 10. null value.", () => {
    expect(mod.prodTypeValues({ prodType: prodTypes, idx: 3 })).toBe(10);
  });
  test("Sum all dict members at index 4 and get 10. undefined value.", () => {
    expect(mod.prodTypeValues({ prodType: prodTypes, idx: 4 })).toBe(10);
  });
});
