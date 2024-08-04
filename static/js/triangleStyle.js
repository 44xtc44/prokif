

/**
 * Overwrite some of the paths on canvas to style them.
 *
 * @param {{*}} option
 */
function styleTriangle(option = {}) {
    const ctx = option.ctx;
    const cx = option.cx;
    const cy = option.cy;
    const directionTxt = option.directionTxt; // "clock", "noClock"
    const side = arrowHead.len;
    const precision = 2; // bi-colored arrow head?
    const directionCoords = getCoords(side, arrowHead, precision);
    console.log("style->", directionCoords);
  
    ctx.strokeStyle = "green";
    ctx.lineWidth = 6;
    ctx.save();
    ctx.translate(cx, cy); // do we need to rotate the ctx for arrow?
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, 2 * Math.PI);
  
    ctx.moveTo(ptr.A.x, ptr.A.y);
    ctx.lineTo(ptr.C.x, ptr.C.y);
    ctx.moveTo(ptr.C.x, ptr.C.y);
    (function drawArrowHeadTriangle() {
      let lineDirection = undefined;
      if (directionTxt === "clock") {
        lineDirection = directionCoords.clock;
      } else {
        lineDirection = directionCoords.noClock;
      }
      lineDirection.forEach((el) => {
        Object.values(el).map((val) => {
          ctx.lineTo(val.x, val.y);
        });
      });
    })();
    ctx.stroke();
    ctx.restore();
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  