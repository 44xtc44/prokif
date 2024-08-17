// getIntersection()
const mod = require("../static/js/dataTernaryPlotCalc");

describe("Calculate intersection point inside the triangl.", () => {
  const edgeLowerX = 200;
  const edgeUpperX = 0;
  const edgeY = 173.20508075688772;
  const triangleEdges = {
    A: { x: -edgeLowerX, y: edgeY },
    B: { x: edgeLowerX, y: edgeY },
    C: { x: edgeUpperX, y: -edgeY },
  };
  test("Calculate point at edge of triangle.", () => {
    expect(
      mod.getIntersection({
        noCO2p: 0,
        lowCO2p: 0,
        isCO2p: 100,
        tPtr: triangleEdges, // can have more triangles for different calculations
        isClockwise: false, // start, end points depend on read direction
      })
    ).toEqual({
      x: edgeLowerX,
      y: edgeY,
    });
  });
  test("Calculate point inside triangle.", () => {
    expect(
      mod.getIntersection({
        noCO2p: 36,
        lowCO2p: 34,
        isCO2p: 30,
        tPtr: triangleEdges, // can have more triangles for different calculations
        isClockwise: false, // start, end points depend on read direction
      })
    ).toEqual({
      x: -11.999999999999988,  // must be accurate, EQUILATERAL TRIANGLE
      y: 55.425625842204056,
    });
  });
});
