// dataTernaryPlotCalc.js
"use strict";

class EnergyStorage {
  constructor() {
    this.maxCountries = 10; // check enough colors first
    this.baseYear = 2015;
    this.year = (() => {
      // year obj to populate dropdown and know when to draw download btn for this year
      const dct = {};
      const thisYear = getYesterday().year;
      for (let aYear = thisYear; aYear >= this.baseYear; aYear--) {
        dct[aYear] = aYear;
      }
      return dct;
    })();
    this.triangleResize = {}; // can resize and feed EnergyMix instance with new coords
    this.countrySelector = []; // [country_code::year, country_code::year] multiple in one diagram
    this.team = (() => {
      const lst = [];
      for (let idx = this.maxCountries; idx >= 1; idx--) {
        // pop() takes from bottom
        lst.push(idx.toString()); // avoid pb concat and calc
      }
      return lst;
    })();
    this.tColor = [...colPalette].reverse(); // must pop()
    this.plotMix = {};
    this.plotIdx = 0; // identify the latest data to draw, distinguish from trails
    this.layoutScale = 0.6; // 500 to 300, why? my old Samsung phone!
    this.triangleLarge = 400;
    this.triangleSmall = this.triangleLarge * this.layoutScale;
    this.canvasImgAntiClock = null; // load triangle SVG as pixel bitmap in mem
    this.canvasScaleAntiClockLarge = "scale(0.86)";
    this.canvasScaleAntiClockSmall = "scale(0.516)";
    this.canvasWidthClockLarge = 430;
    this.canvasWidthAntiClockLarge = 430;
    this.canvasWidthClockSmall = this.canvasWidthClockLarge * this.layoutScale;
    this.canvasWidthAntiClockSmall =
      this.canvasWidthClockLarge * this.layoutScale;
    this.canvasClassAntiClockLarge = "column500";
    this.canvasClassAntiClockSmall = "column300";
    this.canvasClock = document.getElementById("canvasClock"); // read diagram clockwise
    this.clockCtx = this.canvasClock.getContext("2d");
    this.canvasAntiClock = document.getElementById("canvasAntiClock");
    this.antiClockCtx = this.canvasAntiClock.getContext("2d");
  }
}

/**
 * Calculates the distribution of three components inside of a system of 100%.
 * Regardless of the overall performance of the system.
 * {Percent: sum of sub components}, {noCO2:20,lowCO2:40,isCO2:40}
 *
 * How it works?
 * Pulled data for one timestamp from all keys of the country IndexedDB.
 * Instantiate class. Can calc, show multiple countries in one plot.
 * Data assigned to the correct object key.
 * Calc all values = 100%.
 * Calc individual object % of 100%. {no:20,low:45,is:35}
 */
class EnergyMix {
  constructor(options = {}) {
    this.countryCode = options.prodCountry;
    this.prodYear = options.prodYear;
    this.cData = options.cData;
    this.unixSeconds = options.unix_seconds;
    this.noCO2 = options.noCO2; // obj with pv solar arrays of power output nums (mostly hourly)
    this.lowCO2 = options.lowCO2; // nukes water bio geo
    this.isCO2 = options.isCO2; // coal oil gas
    this.prodTypeGroups = [this.noCO2, this.lowCO2, this.isCO2];
    this.noCO2Deviation = 0; //
    this.isClockwise = options.clockwise; // clock or anti-clock reading, bool
    this.ctx = options.ctx; // which canvas
    this.triangleName = options.triangleName; // find it in construction object "triangleResize"
    this.trianglePoints = options.trianglePoints; // current A,B,C (x,y), resize
    this.distObj = {}; // 100% distributed over three items; {isCO2p: 18, lowCO2p: 18, noCO2p: 63}
    this.arrayLen = this.unixSeconds.length;
    this.idx = 0;
    this.plotIdx = 0; // if idx skips hourly
    this.plotPoints = {}; // store {{index:{x,y},}; {{1:{x:2,y:4}}, {2:{x:3,y:5}};
    this.divErrorMessage = document.getElementById("divErrorMessage");
    this.teamNumber = (() => {
      // assignes displayed objects to div in a flex container
      const num = eStore.team.pop();
      const col = eStore.tColor.pop();
      if (!num) {
        const instanceErr = new Error("EnergyMix: No more instances allowed.");
        this.divErrorMessage.innerText =
          "Please refresh browser page and start again \n" + instanceErr;
        this.divErrorMessage.style.display = "block";
        throw instanceErr;
      }
      return { num: num, col: col };
    })();
    // this.removeLeapYear();
    this.syncWeekday();
    // this.trinityDeviation(this.noCO2);
    // this.trinityDeviation(this.lowCO2);
    // this.trinityDeviation(this.isCO2);
  }

  update() {
    const isoDate = getDateParts(this.unixSeconds[this.idx]);
    let hour = isoDate.hour;
    let minute = isoDate.minute;
    if (hour.toString().length < 2) hour = "0".concat(hour);
    if (minute.toString().length < 2) minute = "0".concat(minute);

    let load = this.cData.Load;
    let resi = this.cData.Residual_load;
    let trade = this.cData.Cross_border_electricity_trading;

    const noCO2Sum = this.prodTypeValues({
      prodType: this.noCO2,
      idx: this.idx,
    }); // calc arrays at idx, belonging to noCO2
    const lowCO2Sum = this.prodTypeValues({
      prodType: this.lowCO2,
      idx: this.idx,
    });
    const isCO2Sum = this.prodTypeValues({
      prodType: this.isCO2,
      idx: this.idx,
    });

    const brutto = this.getOverall(noCO2Sum, lowCO2Sum, isCO2Sum);
    this.setPercentDist({
      time: this.unixSeconds[this.idx],
      noCO2Sum: noCO2Sum,
      lowCO2Sum: lowCO2Sum,
      isCO2Sum: isCO2Sum,
      brutto: brutto,
    });

    updateInfoCardMeta({
      prodYear: isoDate.yearDigits,
      monthDayDigit: isoDate.monthDayDigit,
      monthName: isoDate.monthName,
      dayName: isoDate.dayName,
      hour: hour, // pimped
      minute: minute,

      teamNumber: this.teamNumber.num,
      teamColor: this.teamNumber.col,
      idx: this.idx,
      countryCode: this.countryCode,
    });

    updateInfoCardData({
      teamNumber: this.teamNumber.num,
      teamColor: this.teamNumber.col,
      noCO2Sum: this.distObj.noCO2p,
      lowCO2Sum: this.distObj.lowCO2p,
      isCO2Sum: this.distObj.isCO2p,
      brutto: brutto,
      Load: this.isDataValid(load) ? load[this.idx].toFixed() : "NaN",
      Residual_load: this.isDataValid(resi) ? resi[this.idx].toFixed() : "NaN",
      Cross_border_electricity_trading: this.isDataValid(trade)
        ? trade[this.idx].toFixed()
        : "NaN",
    });

    const intersection = this.getIntersection(); // get p(x,y) to draw on triangle, canvas
    if (intersection === null || intersection === undefined) return;
    if (this.plotPoints[this.plotIdx] === undefined)
      this.plotPoints[this.plotIdx] = this.plotIdx;
    this.storePlotPoints(intersection);
    this.adjustPlotTrails();

    eStore.plotIdx = this.plotIdx;
    this.plotIdx += 1;
    if (eStore.plotMix[this.teamNumber.num] === undefined)
      eStore.plotMix[this.teamNumber.num] = {};
    // console.log("pp->", this.teamNumber.num, this.plotPoints);

    eStore.plotMix[this.teamNumber.num].plotPoints = this.plotPoints; // that is actually printed
    eStore.plotMix[this.teamNumber.num].color = this.teamNumber.col;
    eStore.plotMix[this.teamNumber.num].yearDigits = isoDate.yearDigits;
    eStore.plotMix[this.teamNumber.num].monthName = isoDate.monthName;
    eStore.plotMix[this.teamNumber.num].dayName = isoDate.dayName;
    eStore.plotMix[this.teamNumber.num].monthDayDigit = isoDate.monthDayDigit;
    eStore.plotMix[this.teamNumber.num].hour = hour;
    eStore.plotMix[this.teamNumber.num].teamNum = this.teamNumber.num;
    eStore.plotMix[this.teamNumber.num].country = this.countryCode;
    eStore.plotMix[this.teamNumber.num].tradeColor = this.isDataValid(trade)
    ? this.tradeColors(trade[this.idx])
    : "NaN";

    if (this.idx >= this.arrayLen) return;
  }

  isDataValid(badData) {
    let isValid = true;
    if (badData === undefined || badData === NaN || badData === null)
      return false;
    try {
      if (
        badData[this.idx] === undefined ||
        badData[this.idx] === NaN ||
        badData[this.idx] === null
      )
        isValid = false;
    } catch (error) {
      isValid = false;
    }

    return isValid;
  }

  tradeColors(number) {
    const trade = this.cData.Cross_border_electricity_trading;
    if (Number(trade[0]).toString() === "NaN") return "NaN";
    if (Number(number).toString() === "NaN") return "NaN";

    const greenThree = "hsl(168, 76%, 36%)";  // 10.000
    const greenTwo = "hsl(168, 76%,60%)";   // 5.000
    const greenOne = "hsl(168, 76%, 76%)";   // 1.000
    const greenZero = "hsl(168, 76%, 85%)";  // 1 - 500

    const magentaZero = "hsl(300,100%,95%)";  // 0 - -500
    const magentaOne = "hsl(300,100%,85%)";
    const magentaTwo = "hsl(300,100%,75%)";
    const magentaThree  = "hsl(300,100%,50%)";

    if (number > 1 && number < 500) return greenZero;
    if (number >= 500 && number < 1000) return greenOne;
    if (number >= 1000 && number < 5000) return greenTwo;
    if (number >= 5000 ) return greenThree;

    if (number <= 0 && number > -500) return magentaZero;
    if (number <= -500 && number > -1000) return magentaOne;
    if (number <= -1000 && number > -5000) return magentaTwo;
    if (number <= -5000 ) return magentaThree;


/*     const tMin = Math.min(...trade);
    const tMax = Math.max(...trade);
    const allBuy = trade.reduce((accu, val) => {
      const numVal = Number(val);
      if (numVal < 0) accu += Math.abs(numVal);
      return accu;
    }, 0);
    const allSell = trade.reduce((accu, val) => {
      const numVal = Number(val);
      if (numVal > 0) accu += Math.abs(numVal);
      return accu;
    }, 0); */
    
  }

  syncWeekday() {
    const isChecked = document.getElementById("spanSyncWeekday");
    if (isChecked.dataset.value === "false") return;
    const candidates = [];
    const getCandidates = () => {
      // go for, can not break reduce, forEach
      for (let i = 0; i < this.unixSeconds.length; i++) {
        const timeStamp = this.unixSeconds[i];
        const isoDate = getDateParts(timeStamp);
        if (isoDate.dayName == "Sun" && isoDate.hour == "0") break;
        candidates.push(i);
      }
    };
    getCandidates();

    const shrinkArray = [
      this.unixSeconds,
      this.cData.Load,
      this.cData.Residual_load,
      this.cData.Cross_border_electricity_trading,
    ];

    try {
      shrinkArray.map((array) =>
        array.splice(candidates[0], candidates.length)
      );

      this.prodTypeGroups.slice(0).map((_, idx) => {
        // clone array, else del by run over
        Object.values(this.prodTypeGroups[idx]).map((array) =>
          array.splice(candidates[0], candidates.length)
        );
      });
    } catch (error) {
      console.error(this.countryCode, this.prodYear, error);
    }
  }

  removeLeapYear() {
    // del Feb 29 indexes from all raw data, backwards, BUT will fail weekday sync
    const isoDate = getDateParts(this.unixSeconds[this.idx]);
    const yearDigits = isoDate.yearDigits;
    if (!leapYear.includes(yearDigits)) return;
    const candidates = [];
    const getCandidates = () => {
      // go for, can not break reduce, forEach
      for (let i = 0; i < this.unixSeconds.length; i++) {
        const timeStamp = this.unixSeconds[i];
        const isoDate = getDateParts(timeStamp);
        if (isoDate.monthDayDigit == 29 && isoDate.monthName == "Feb")
          candidates.push(i);
        if (isoDate.monthName == "Mar") break;
      }
    };
    getCandidates();

    const shrinkArray = [
      this.unixSeconds,
      this.cData.Load,
      this.cData.Residual_load,
      this.cData.Cross_border_electricity_trading,
    ];

    try {
      shrinkArray.map((array) =>
        array.splice(candidates[0], candidates.length)
      );

      this.prodTypeGroups.slice(0).map((_, idx) => {
        // clone array, else del by run over
        Object.values(this.prodTypeGroups[idx]).map((array) =>
          array.splice(candidates[0], candidates.length)
        );
      });
    } catch (error) {
      console.error(this.countryCode, this.prodYear, error);
    }
  }

  trinityDeviation(trinityMember) {
    // https://www.studienkreis.de/mathematik/varianz-standardabweichung/
    // https://www.scribbr.de/statistik/standardabweichung/
    // calculate the deviation for each trinity member 1.1 2:00 noCO2 50%, 1.1 3:00 noCO2 52%
    // percent val weight should be same as array weight - needs calc
    // each trinity mem deviation median is deviation for this year
    console.log("trinityDeviation->");
    let sumAll = 0;
    const arrayLen = this.unixSeconds.length; // need array len, trinityMember

    for (let i = 0; i < arrayLen; i++) {
      const sumIdx = this.prodTypeValues({
        prodType: trinityMember,
        idx: this.idx,
      });
      sumAll += sumIdx;
    }
    let sumAvgSquare = 0;
    const average = sumAll / arrayLen;
    for (let i = 0; i < arrayLen; i++) {
      // Math.pow(base, exponent)  (3, 3) 27 (7, 2) 49
      sumAvgSquare += Math.pow(i - average, 2);
    }
    const variance = sumAvgSquare / (arrayLen - 1); // -1 Stichprobe sample, else Grundgesamtheit population
    // Math.sqrt() Returns the positive square root of the input.
    const standardDeviation = Math.sqrt(variance);
    console.log(
      "preRun->average, variance, stdDev",
      average.toFixed(),
      variance.toFixed(),
      standardDeviation.toFixed()
    );
    return variance;
  }
  prodTypeValues(options = {}) {
    const sum = Object.keys(options.prodType).reduce((accu, prodKeyName) => {
      // (-) means imported of this type (-2500)
      // pdf "Electricity generation in Germany in 2023" Prof. Dr. Bruno Burger
      // Fraunhofer ISE
      let currentVal = options.prodType[prodKeyName][options.idx];
      if (currentVal === null || currentVal === undefined) currentVal = 0;
      if (currentVal <= 0) currentVal = 0;
      accu += currentVal;
      return accu;
    }, 0);
    return sum;
  }
  getOverall(noCO2Sum, lowCO2Sum, isCO2Sum) {
    const sum = noCO2Sum + lowCO2Sum + isCO2Sum;
    return sum;
  }
  setPercentDist(options = {}) {
    this.distObj = {
      noCO2p: ((options.noCO2Sum / options.brutto) * 100).toFixed(),
      lowCO2p: ((options.lowCO2Sum / options.brutto) * 100).toFixed(),
      isCO2p: ((options.isCO2Sum / options.brutto) * 100).toFixed(),
    };
    // console.log("----setPercentDist---->", this.distObj);
  }
  /**
   * Calc component distribution intersection point p(x,y) in the ternary plot.
   * (A) Get the start and end of a line representing a component in the diagram.
   * (B) Get the line intersection points p(x,y) with the triangle at a certain
   * percent number. As if you would read it on the diagram.
   * (C) Calc intersection with a second component line inside of the triangle.
   * That is the point p(x,y) to draw on the plot.
   * (D) Calc the same for two other possible line intersections. They all must
   * come to the same result, if data sets are complete and valid. Else we get at
   * least (hopefully) one valid calculation. Filter it out.
   * Anti-clockwise reading:
   * b - noCO2 - CA, line left to right, read btm scale down right to 100%
   * c - isCO2 - AB, line right to left, read right scale upwards, parallel c side
   * a - lowCO2 - BC, right to left, left scale goes (downwards) to 100% at btm
   * Line intersection of percent scales on triangle rulers reading.
   * 63% noCO2 line left to right start: bottom[63], end: right[100-63]
   * 18% lowCO2 line right to left start: left[18], end: btm[100-63]
   * 18% isCO2
   * I use slash (CA), backslash (BC) and bottom (AB) to identify the lines to move.
   * Pure madness protection.
   */
  getIntersection() {
    /**
     *         C
     *        /\
     *       /  \  M is center of circle inside, also of triangle
     *      /    \
     *     /   M  \                     ^
     *  A /________\ B  bottom -> right | , anti-clock
     */
    // distObj{isCO2p: 18, lowCO2p: 18, noCO2p: 63}; percent on the triangle side, ruler.
    const noCO2p = this.distObj.noCO2p;
    const lowCO2p = this.distObj.lowCO2p;
    const isCO2p = this.distObj.isCO2p;
    const tPtr = this.trianglePoints[this.triangleName].ptr; // can have more triangles for different calculations
    const isClockwise = this.isClockwise; // start, end points depend on read direction
    // getPositionAlongTheLine(x1, y1, x2, y2, percentage as 0-1)
    // debugger
    // calc the 60° white lines inside the triangle (only one here)
    const bottomReadStart = getPositionAlongTheLine(
      // get point on way A -> B
      tPtr.A.x, // triangle A p(x,.) on coord system
      tPtr.A.y, // triangle A p(.,y) on coord system
      tPtr.B.x,
      tPtr.B.y,
      isCO2p / 100 // CO2 line starts at 80% at bottom
    );
    const bottomReadEnd = getPositionAlongTheLine(
      tPtr.B.x,
      tPtr.B.y,
      tPtr.C.x,
      tPtr.C.y,
      1 - isCO2p / 100 // 1 - (80%/100) = 0.2; line ends at 20% lowCO2
    );
    const rightReadStart = getPositionAlongTheLine(
      tPtr.C.x,
      tPtr.C.y,
      tPtr.A.x,
      tPtr.A.y,
      noCO2p / 100
    );
    const rightReadEnd = getPositionAlongTheLine(
      tPtr.A.x,
      tPtr.A.y,
      tPtr.B.x,
      tPtr.B.y,
      1 - noCO2p / 100
    );
    const leftReadStart = getPositionAlongTheLine(
      tPtr.B.x,
      tPtr.B.y,
      tPtr.C.x,
      tPtr.C.y,
      lowCO2p / 100
    );
    const leftReadEnd = getPositionAlongTheLine(
      tPtr.C.x,
      tPtr.C.y,
      tPtr.A.x,
      tPtr.A.y,
      1 - lowCO2p / 100
    );
    // calc intersection; read direction matters, clockwise end to start; need new fun
    const interSlashBtm = lineIntersection(
      { x: bottomReadStart.x, y: bottomReadStart.y }, // l1 start
      { x: bottomReadEnd.x, y: bottomReadEnd.y }, // l1 end
      { x: leftReadStart.x, y: leftReadStart.y }, // l2 start
      { x: leftReadEnd.x, y: leftReadEnd.y } // l2 end
    );
    const interSlasBSlash = lineIntersection(
      { x: bottomReadStart.x, y: bottomReadStart.y }, // l1 start
      { x: bottomReadEnd.x, y: bottomReadEnd.y }, // l1 end
      { x: rightReadStart.x, y: rightReadStart.y }, // l2 start
      { x: rightReadEnd.x, y: rightReadEnd.y } // l2 end
    );
    const interBSlashBtm = lineIntersection(
      { x: rightReadStart.x, y: rightReadStart.y }, // l1 start
      { x: rightReadEnd.x, y: rightReadEnd.y }, // l1 end
      { x: leftReadStart.x, y: leftReadStart.y }, // l2 start
      { x: leftReadEnd.x, y: leftReadEnd.y } // l2 end
    );
    const iSectList = [interSlashBtm, interSlasBSlash, interBSlashBtm];
    const someFailed = iSectList.some((obj) => obj === null);

    if (someFailed) {
      if (
        // full catastrophe
        iSectList[0] === null &&
        iSectList[1] === null &&
        iSectList[2] === null
      )
        return null;
      if (iSectList[0] !== null) return iSectList[0];
      if (iSectList[1] !== null) return iSectList[1];
      if (iSectList[2] !== null) return iSectList[2];
    }

    return iSectList[0];
  }

  storePlotPoints(intersection) {
    // all prev points are (this.plotIdx - 1), (this.plotIdx - 2)
    this.plotPoints[this.plotIdx] = { x: intersection.x, y: intersection.y };
  }

  adjustPlotTrails() {
    // store x amount of points in the dict, to draw, del some
    // { 0: {x,y}, 1:{x,x}, 2:{x,y} }
    const ppLen = Object.keys(this.plotPoints).length;
    const oKeysPp = Object.keys(this.plotPoints);

    const plotTrails = parseInt(
      document.getElementById("inputPlotTrails").value
    );
    if (ppLen > plotTrails) {
      const delPoints = ppLen - plotTrails;
      for (let i = 0; i < delPoints; i++) {
        delete this.plotPoints[oKeysPp[i]];
      }
    }
  }
}

/* ----------------------------------------------------------------------------------- */

function updateInfoCardMeta(options = {}) {
  const col = options.teamColor;
  const teamColor = "rgb(".concat(col[0], " ", col[1], " ", col[2], " / 100%");

  let hour = options.hour;
  let minute = options.minute;
  if (hour.toString().length < 2) hour = "0".concat(hour);
  if (minute.toString().length < 2) minute = "0".concat(minute);
  const id = document.getElementById("divIdentify__" + options.teamNumber);
  const date = document.getElementById(
    "divMonthDayDigit__" + options.teamNumber
  );
  const time = document.getElementById("divTime__" + options.teamNumber);

  id.innerText = countryCodes[options.countryCode].concat(
    " : ",
    options.prodYear
  );
  id.style.color = teamColor;
  date.innerText = "".concat(
    options.monthDayDigit,
    " : ",
    options.monthName,
    " : ",
    options.dayName
  );
  time.innerHTML = "<span class='spanDescriptorCol'> time: </span>".concat(
    hour,
    ":",
    minute
  );
}

function updateInfoCardData(options = {}) {
  const noCO2 = document.getElementById("divNoCO2__" + options.teamNumber);
  const lowCO2 = document.getElementById("divLowCO2__" + options.teamNumber);
  const isCO2 = document.getElementById("divIsCO2__" + options.teamNumber);
  const load = document.getElementById("divLoad__" + options.teamNumber);
  const resi = document.getElementById(
    "divResidual_load__" + options.teamNumber
  );
  const trade = document.getElementById(
    "divCross_border_electricity_trading__" + options.teamNumber
  );
  noCO2.innerHTML = "<span class='spanDescriptorCol'> noco2: </span>".concat(
    "<span class='spanNoCO2Col'>",
    options.noCO2Sum,
    " %",
    "</span>"
  );
  lowCO2.innerHTML = "<span class='spanDescriptorCol'> lowco2: </span>".concat(
    "<span class='spanLowCO2Col'>",
    options.lowCO2Sum,
    " %",
    "</span>"
  );
  isCO2.innerHTML = "<span class='spanDescriptorCol'> co2: </span>".concat(
    "<span class='spanIsCO2Col'>",
    options.isCO2Sum,
    " %",
    "</span>"
  );
  load.innerHTML = "<span class='spanDescriptorCol'> load: </span>".concat(
    options.Load
  );
  resi.innerHTML = "<span class='spanDescriptorCol'> resi: </span>".concat(
    options.Residual_load
  );
  trade.innerHTML = "<span class='spanDescriptorCol'> trade: </span>".concat(
    options.Cross_border_electricity_trading
  );
}