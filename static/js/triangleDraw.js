// triangleDraw.js
"use strict";

/**
 * Draw of inscribed circle in triangle.
 * To verify a valid triangle was drawn.
 * @param option.ctx on which canvas to draw
 * @param option.side px side len of triangle
 * @param option.cx translation center point of context
 * @param option.cy translation center point of context
 */
function drawCircle(option = {}) {
  const ctx = option.ctx;
  const side = option.side;
  const cx = option.cx;
  let cy = option.cy;
  const h = side * (Math.sqrt(3) / 2);
  const radius = (Math.sqrt(3) / 6) * side;
  cy = cy + h / 2 - radius;

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2, false);
  ctx.stroke();
  ctx.closePath();
}

/**
 * Triangle side objects are calculated now,
 * percent scale points at the side (ruler).
 * At first we do not draw direct lines from A-B-C-A.
 * Instead we use the scale of the ruler to connect
 * percent 1 to %2, to %3. Show that this gives a straight line.
 * @param {*} option
 */
function drawTriangle(options = {}) {
  const ctx = options.ctx;
  const cx = options.cx;
  const cy = options.cy;
  const coords = options.coords;

  ctx.strokeStyle = "magenta";
  ctx.lineWidth = 8;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  /**
   * Use all those coord/path pieces to draw % marks
   * Can use a second 'full run' to
   * (A) arrow head direction, (B) color gradient.
   */
  function drawEquilateralTriangle() {
    coords.forEach((sidePtDict) => {
      Object.values(sidePtDict).map((val) => {
        ctx.lineTo(val.x, val.y);
      });
    });
  }
  drawEquilateralTriangle();

  const rightSide = coords[0];
  const leftSide = coords[1];
  const btmSide = coords[2];
  // moveTo bSide[%][xCoord], bSide[%][yCoord]

  // ctx.moveTo(leftSide[40]["x"], leftSide[40]["y"]);
  // ctx.lineTo(rightSide[80]["x"], rightSide[80]["y"]);
  // ctx.lineTo(btmSide[10]["x"], btmSide[10]["y"]);
  // ctx.moveTo(btmSide[40]["x"], btmSide[40]["y"]);
  // ctx.lineTo(leftSide[10]["x"], leftSide[10]["y"]);
  // ctx.moveTo(leftSide[20]["x"], leftSide[20]["y"]);
  // ctx.lineTo(rightSide[10]["x"], rightSide[10]["y"]);

  // option: show center https://www.geeksforgeeks.org/program-to-find-the-incenter-of-a-triangle/

  // show/test path to opposite

  function displayPointsInConsole(ptListObj) {
    const right = ptListObj[0];
    const left = ptListObj[1];
    const btm = ptListObj[2];
    console.log("displayPoints->", right, left, btm);
  }
  // displayPointsInConsole(drawDirection);

  function testRun() {
    const rightSide = drawDirection[0];
    const leftSide = drawDirection[1];
    const btmSide = drawDirection[2];
    /// ctx.moveTo(leftSide[40]["x"], leftSide[40]["y"]);
    // use ctx.beginPath(); before moveTo, else garbage
    ctx.moveTo(leftSide[40]["x"], leftSide[40]["y"]);
    ctx.lineTo(rightSide[80]["x"], rightSide[80]["y"]);
    ctx.lineTo(btmSide[10]["x"], btmSide[10]["y"]);
    /*     ctx.beginPath();
      ctx.moveTo(btmSide[40]["x"], btmSide[40]["y"]);
      ctx.lineTo(leftSide[10]["x"], leftSide[10]["y"]);
      ctx.beginPath();
      ctx.moveTo(btmSide[90]["x"], btmSide[90]["y"]);
      ctx.lineTo(rightSide[80]["x"], rightSide[80]["y"]); */
  }
  // testRun();

  ctx.stroke();
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

class AnimateDrawTriangle {
  constructor(options = {}) {
    this.ctx = options.ctx;
    this.canvas = options.canvas;
    this.cx = options.cx;
    this.cy = options.cy;
    this.side = options.side;
    // dict of three dicts of points(x,y)
    // side dict {1:{x,y}, 2:{x,y}} to create ruler knops on the triangle sides
    this.coords = options.coords;
    this.coordsIdx = 1; // movto steps one back each cycle
    this.isDrawn = false;
    this.pointAArray = []; // more easy to think an array animation
    this.pointBArray = []; // side b points
    this.pointCArray = [];
    this.populateLists();
  }
  populateLists() {
    this.coords.map((triangleSide, idx) => {
      Object.values(triangleSide).map((point) => {
        if (idx === 0) this.pointAArray.push(point);
        if (idx === 1) this.pointBArray.push(point);
        if (idx === 2) this.pointCArray.push(point);
      });
    });
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawAllEdges() {
    if (this.isDrawn) return;
    const a = this.pointAArray;
    const b = this.pointBArray;
    const c = this.pointCArray;
    const i = this.coordsIdx;
    
    this.ctx.lineWidth = 4;
    this.ctx.save();
    this.ctx.translate(this.cx, this.cy);
    this.ctx.beginPath();
    this.ctx.moveTo(a[i-1].x, a[i-1].y);
    this.ctx.lineTo(a[i].x, a[i].y);
    this.ctx.strokeStyle = "#f7b733";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(b[i-1].x, b[i-1].y);
    this.ctx.lineTo(b[i].x, b[i].y);
    this.ctx.strokeStyle = "#49bbaa";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(c[i-1].x, c[i-1].y);
    this.ctx.lineTo(c[i].x, c[i].y);
    this.ctx.strokeStyle = "#fc4a1a";
    this.ctx.stroke();
    this.ctx.restore();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (this.coordsIdx >= this.pointAArray.length - 1) {
      this.isDrawn = true;
      this.drawInboundCircle();
      setTimeout(() => {  // context thingy
        cancelAnimationFrame(animationFrameCount);
      }, 0);
      setTimeout(() => {
        this.clearCanvas();
        document.getElementById("divColumnOne").style.display = "none";
      }, 2000);
    }
    this.coordsIdx += 1;
  }
  drawInboundCircle() {
    const h = this.side * (Math.sqrt(3) / 2);
    const radius = (Math.sqrt(3) / 6) * this.side;
    this.cy = this.cy + h / 2 - radius;
  
    this.ctx.strokeStyle = "rgba(160, 164, 133, 1)";
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(this.cx, this.cy, radius, 0, Math.PI * 2, false);
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
