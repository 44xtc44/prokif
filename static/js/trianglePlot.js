// trianglePlot.js
// prefer https://stackoverflow.com/questions/54865655/we-have-2-lines-how-can-we-get-point-where-that-2-lines-intersect-with-javascri
// https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/

// https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
//
// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
// mod by 44xtc44 - x1 start line1, x2 end line1
/**
 *
 *  @param {number} x1 - point x coordinate
 *  @param {number} y1 - point y coordinate
 *  @param {number} x2 - point x coordinate
 *  @param {number} y2 - point y coordinate
 *  @param {number} x3 - point x coordinate
 *  @param {number} y3 - point y coordinate
 *  @param {number} x4 - point x coordinate
 *  @param {number} y4 - point y coordinate
 * @returns {{x:Number,y:Number}} X and Y coordinates of intersection point.
 * @returns
 */
function intersect(option = {}) {
  const x1 = option.x1;
  const y1 = option.y1;
  const x2 = option.x2;
  const y2 = option.y2;
  const x3 = option.x3;
  const y3 = option.y3;
  const x4 = option.x4;
  const y4 = option.y4;

  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  console.log("isIntersect->", x, y);
  return { x, y };
}

function ____intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return { x, y };
}

/** ------------------------------------------------------------------------------------------------------ */

var Point = function (valA, valB) {
  this.x = valA;
  this.y = valB;
};

function lineIntersection(pointA, pointB, pointC, pointD) {
  var z1 = pointA.x - pointB.x;
  var z2 = pointC.x - pointD.x;
  var z3 = pointA.y - pointB.y;
  var z4 = pointC.y - pointD.y;
  var dist = z1 * z4 - z3 * z2;
  if (dist == 0) {
    return null;
  }
  var tempA = pointA.x * pointB.y - pointA.y * pointB.x;
  var tempB = pointC.x * pointD.y - pointC.y * pointD.x;
  var xCoor = (tempA * z2 - z1 * tempB) / dist;
  var yCoor = (tempA * z4 - z3 * tempB) / dist;

  if (
    xCoor < Math.min(pointA.x, pointB.x) ||
    xCoor > Math.max(pointA.x, pointB.x) ||
    xCoor < Math.min(pointC.x, pointD.x) ||
    xCoor > Math.max(pointC.x, pointD.x)
  ) {
    return null;
  }
  if (
    yCoor < Math.min(pointA.y, pointB.y) ||
    yCoor > Math.max(pointA.y, pointB.y) ||
    yCoor < Math.min(pointC.y, pointD.y) ||
    yCoor > Math.max(pointC.y, pointD.y)
  ) {
    return null;
  }
  return new Point(xCoor, yCoor);
}
