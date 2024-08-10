// https://dev.to/dstrekelj/how-to-test-classes-with-jest-jif
// https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs
// "test": "jest --watchAll" hangs GitHub actions 

const mod = require("./../static/js/dataTernaryPlotCalc");
// adjustPlotTrails

describe("Adjust plot trails, displayed amount of data.", () => {
  plotPoints = {
    0: { x: 36, y: 55 },
    1: { x: 37, y: 56 },
    2: { x: 38, y: 57 },
    3: { x: 39, y: 50 },
    4: { x: 40, y: 80 },
  };

  test("Do not delete data if number of trails matches count of key:val pairs.", () => {
    expect(
      mod.adjustPlotTrails({ numTrails: 5, plotPoints: plotPoints })
    ).toEqual({
      0: { x: 36, y: 55 },
      1: { x: 37, y: 56 },
      2: { x: 38, y: 57 },
      3: { x: 39, y: 50 },
      4: { x: 40, y: 80 },
    });
  });

  test("Del plot points from dict, if fewer trails demanded than points are in dict.", () => {
    expect(
      mod.adjustPlotTrails({ numTrails: 3, plotPoints: plotPoints })
    ).toEqual({
      2: { x: 38, y: 57 },
      3: { x: 39, y: 50 },
      4: { x: 40, y: 80 },
    });
  });
});
