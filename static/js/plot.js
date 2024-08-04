// plot.js
"use strict";

/**
 * Print data points of multiple EnergyMix instances.
 * Must clear canvas before multiple draws on top.
 * @param {*} options
 */
function plotter(options = {}) {
  const cx = options.cx;
  const cy = options.cy;
  const ctx = options.ctx;
  const canvas = options.canvas;
  const data = options.instancesData;
  const plotIdx = options.plotIdx.toString();
  const keys = Object.keys(data);
  const inputLineWidth = document.getElementById("inputLineWidth").value;
  const spanShowTrade = document.getElementById("spanShowTrade").dataset.value;

  if (spanShowTrade === "false") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // faster mem copy than drawing img from dom element
    ctx.putImageData(eStore.canvasImgAntiClock, 0, 0);
  } else {
    // upper left and right date and country description
    ctx.clearRect(0, 0, 110, 120);
    ctx.clearRect(canvas.width - 100, 0, 100, 120);
  }

  for (let team = 1; team <= keys.length; team++) {
    // team loop (country)
    // got a null error here; race condition interpreter overloaded?
    if (data[team] === undefined || data[team] === NaN || data[team] === null)
      return;
    const plotPoints = data[team].plotPoints;
    const oKeys = Object.keys(plotPoints);
    const pXnull = plotPoints[oKeys[0]].x;
    if (pXnull.toString() === "NaN") continue; // jump to next cycle

    const col = data[team].color; // list [255,0,0]
    const trail = "rgb(".concat(col[0], " ", col[1], " ", col[2], " / 80%");
    const head = "rgb(".concat(col[0], " ", col[1], " ", col[2], " / 100%");
    const shape = data[team].shape; // rect, circle, tri

    const hour = data[team].hour;
    const yearDigits = data[team].yearDigits;
    const dayName = data[team].dayName;
    const monthName = data[team].monthName;
    const monthDayDigit = data[team].monthDayDigit;
    const teamNum = data[team].teamNum;
    const country = data[team].country;
    const tradeColor = data[team].tradeColor;

    ctx.lineWidth = inputLineWidth;
    ctx.save();
    ctx.translate(cx, cy);

    Object.keys(plotPoints).map((point) => {
      // newest point plus some from the past
      ctx.beginPath;
      ctx.strokeStyle = trail;
      if (point === plotIdx) ctx.strokeStyle = head;
      if (spanShowTrade === "false") {
        ctx.strokeRect(plotPoints[point].x, plotPoints[point].y, 16, 16);
        ctx.stroke();
      }
      if (spanShowTrade === "true" && plotPoints[point].x !== "NaN") {
        ctx.fillStyle = tradeColor;
        ctx.fillRect(plotPoints[point].x, plotPoints[point].y, 2, 2);
        ctx.fill();
      }
    });

    if (monthDayDigit !== null && teamNum === "1") {
      // first team shows time and date left
      ctx.beginPath;
      ctx.font = "24px Raleway";
      ctx.fillStyle = "lightYellow";
      ctx.fillText(yearDigits, -200, -190);
      ctx.fillText(monthName.concat(" : ", monthDayDigit), -200, -160);
      ctx.fillText(dayName, -200, -130);
      ctx.fillText(hour, -200, -100);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath;
      ctx.font = "16px Raleway";
      ctx.fillStyle = head;
      ctx.fillText(country.concat(" : ", yearDigits), 145, -200);
      ctx.fill();
      ctx.closePath();
    }
    if (teamNum !== "1" && monthDayDigit !== null) {
      ctx.beginPath;
      ctx.font = "16px Raleway";
      ctx.fillStyle = head;
      ctx.fillText(country.concat(" : ", yearDigits), 145, -220 + 20 * teamNum);
      ctx.fill();
      ctx.closePath();
    }
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset context
  }
}
