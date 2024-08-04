// triangleCalc.js
"use strict";

function reseizeTriangle(options = {}) {
  const id = options.id; // triangle visible in dev mode drawTriangle()
  const side = options.side; // boundaries for the diagram spots/intersection points
  const precision = options.precision; // for option drawing show, how many parts one side consists of
  const clockwise = options.clockwise; // clock or antiClock readable ternary plot; where spots are drawn

  const triangle = constructTriangle({
    id: id,
    side: side,
    precision: precision,
  });
  // construction data
  eStore.triangleResize[id] = triangle;

  // drawing data for canvas and center point
  let ctx = clockwise ? eStore.clockCtx : eStore.antiClockCtx;
  let canvas = clockwise ? eStore.canvasClock : eStore.canvasAntiClock;
  let cx = clockwise
    ? eStore.canvasClock.width / 2
    : eStore.canvasAntiClock.width / 2;
  let cy = clockwise
    ? eStore.canvasClock.height / 2
    : eStore.canvasAntiClock.height / 2;

  const coords = getCoords(triangle); // points along sides; for a drawing show
  let coordsDirection = clockwise ? coords.clock : coords.antiClock;

  return {
    id: id,
    side: side,
    coords: coordsDirection,
    ctx: ctx,
    canvas: canvas,
    cx: cx,
    cy: cy,
  };
}

/**
 * Equilateral triangle construction.
 * @param options.id name of triangle
 * @param options.side triangle side len in pixel
 * @param options.precision amount of side segments (1/precision len)
 * @returns {{}} object
 */
function constructTriangle(options = {}) {
  const id = options.id;
  const side = options.side;
  const precision = options.precision;
  const h = side * (Math.sqrt(3) / 2); // aka 90°_| 's'
  const construction = {
    id: id,
    side: side,
    h: h,
    precision: precision,
    ptr: null,
  };
  const ptr = {
    A: { x: -side / 2, y: h / 2 },
    B: { x: side / 2, y: h / 2 },
    C: { x: 0, y: -h / 2 },
  };
  construction.ptr = ptr;
  return construction;
}

/**
 * Feeder for triangle drawer. Can draw in mini steps. User show.
 * Not needed to calc line start/end, intersections anymore.
 * Class EnergyMix, method getIntersection does it on the fly with pure math.
 * Origin->target; Is clockwise? Coords list will be [{2,4}, {4,7}] or [{4,7}, {2,4}].
 * @param {Number} side len of triangle side
 * @param {{}} coords triangle object describes (x,y) coords/points for A,B,C edges
 * @param {Number} precision 100 means, 'side' is split in 100 segments/points; 1.000 -> 1.000
 * @returns {{clock:{percent: {x:Number,y:Number},{}}}} or same with "antiClock" key
 * to prepare a diagram with rulers in opposite direction %, clockwise diagram reading or not
 * @see ptr (global) default input object for triangle coords param
 * {antiClock:{{1: {x: 1,2,y:3,6}}, 2: {x: 4,3,y:5,1}}} use percent scale -> ruler points
 */
function getCoords(options = {}) {
  const ptr = options.ptr;
  const precision = options.precision;
  const directions = {
    // returns obj with 5% to coords p5(x,y), 6% to p6(x,y) lists
    clock: (function () {
      return getClock();
    })(), // self caller
    antiClock: (function () {
      return getAntiClock();
    })(),
  };

  function getClock() {
    const rightSide = getPoints({ origin: ptr.C, target: ptr.B, p: precision });
    const leftSide = getPoints({ origin: ptr.A, target: ptr.C, p: precision });
    const btmSide = getPoints({ origin: ptr.B, target: ptr.A, p: precision });
    const sideLst = [rightSide, leftSide, btmSide];
    return sideLst;
  }
  function getAntiClock() {
    const rightSide = getPoints({ origin: ptr.B, target: ptr.C, p: precision });
    const leftSide = getPoints({ origin: ptr.C, target: ptr.A, p: precision });
    const btmSide = getPoints({ origin: ptr.A, target: ptr.B, p: precision });
    const sideLst = [rightSide, leftSide, btmSide];
    return sideLst;
  }
  return directions;
}

/**
 * Returned obj {} is used to calc a path between itself at %
 * and a second obj at % on the side ruler of triangle diagram.
 *
 * In other words:
 * Used, to get a path from coord side a{x,y} to side c{x,y} or side b{x,y}.
 * Then check at which point (x, y) the two lines intersect with 'intersect()'.
 * Need to create a global object (class or dict)
 * to update the current coordinate(s), (x+2,y+2), if animated.
 *
 * Then the 3rd path is not needed. 3rd MUST intersect also there.
 * Edge case one or more 0%, or 100%. Must be detected before calculation.
 * Due to the 100% result rule of the 3 given data sample input for ternary plot.
 * (30%,20%,50%) (100%,0%,0%) (20%,80%,0%) if(oneOfThem is 0 || oneOfThem is 100)
 *
 * No accumulation of input array.
 * @param options.origin start {x: Number, y: Number} triangle edge point
 * @param options.target target {x: Number, y: Number} triangle edge point
 * @param options.precision of 'ruler marks', amount of points on the ruler
 * @returns {{Number:{x:Number,y:Number}, ...}}; outer {} is %, inner {} is coords
 */
function getPoints(options = {}) {
  const precision = options.p;
  const stepper = Array.from({ length: precision + 1 }, (_, k) => k + 1); // +1; [0...100]
  const points = stepper.slice(0).reduce((acc, _, idx, array) => {
    // make cp slice(0); array arg 4 is the cp
    // if(idx === 82) array.splice(1)  // get out early, destroy cp
    acc[idx] = createSideRuler({
      // {{1: {x: 1,2,y:3,6}}, 2: {x: 4,3,y:5,1}} percent->point
      origin: options.origin,
      target: options.target,
      percent: idx / precision,
    });
    return acc;
  }, {});
  return points;
}

/**
 * Imaginary straight line between p1(x1,y1) and p2(x2,y2)
 * is cut at percent x.
 *
 * @param {Number} x1 p1 x origin
 * @param {Number} y1 p1 y origin
 * @param {Number} x2 p2 x destination
 * @param {Number} y2 p2 y destination
 * @param {Number} percentage between 0 and 1, where to cut the line
 * @returns {{x: Number, y: Number}} intersection at percent
 */
function getPositionAlongTheLine(x1, y1, x2, y2, percentage) {
  return {
    x: x1 * (1.0 - percentage) + x2 * percentage,
    y: y1 * (1.0 - percentage) + y2 * percentage,
  };
}

/**
 * Called numerous times to create the side rulers (points objects) for the diagram.
 * Wrap the fun request with dependency injector to keep the reading cleaner.
 *
 * @param options.origin start {x: Number, y: Number} triangle edge point
 * @param options.target target {x: Number, y: Number} triangle edge point
 * @param options.percent precision of 'ruler marks', amount of points on the ruler
 * @returns {{x: Number, y: Number}} target coords for next ruler mark
 */
function createSideRuler(options = {}) {
  const stopPoint = getPositionAlongTheLine(
    options.origin.x,
    options.origin.y,
    options.target.x,
    options.target.y,
    options.percent
  );
  return stopPoint;
}
