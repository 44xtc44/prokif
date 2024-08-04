// dataTernaryPlotSetup.js
"use strinct";

/**
 * Storage, cache for country data sets.
 * Show a closure in action in my repo. Not a fan boy.
 * Just for the sake of my art.
 *
 * Function expression closure with setter and getter.
 * Not hoisted. Set, get values may not be arrow functions.
 *
 * Save/add the result of a DB request promise
 * via callback into a closure.
 * @param set callback result, object of an IndexDB get() request,
 * @param countryCode second arg setter, "fr", "bg"
 * @param year of data set
 * @param get get stored object from this closure
 * @returns {String: {String: Object}} {countryCode: {year: Data}}
 * @example
 * const dataCall = datahome();  // instantiate first fun expression
 * dataCall.set(data, "fr", "2023")
 * dataCall.get();  // print {"fr": {2023: {Nuclear:...}, {Coal:...}}}
 */
const datahome = () => {
  return {
    get: function () {
      return this.dataVault; // undefined if unset
    },
    set: function (dataObj, countryCode, year) {
      // NOT arrow function
      if (this.dataVault === undefined) this.dataVault = {};
      if (this.dataVault[countryCode] === undefined)
        this.dataVault[countryCode] = {};
      this.dataVault[countryCode][year] = dataObj;
      return this.dataVault;
    },
  };
};
/**
 * Second function expression needed to access the stored val of the closure.
 */
const dataCall = datahome();

/**
 * Assign the production types to one of three objects.
 * [noCO2] pv wind;
 * [lowCO2] nukes water bio geo;
 * [isCO2] coal oil gas
 * @param options.countryCode country
 * @param options.year year
 * @param options.call fun call result of getting data out of the closure
 * @returns {trinity: Data, timestamps: Number, countryCode: String}
 * @example
 * const trinity = createTrinityFromClosure({
 *   countryCode: "de",
 *   year: "2023",
 *   call: () => dataCall.get(),
 * });
 */
function createTrinityFromClosure(options = {}) {
  const data = options.call();
  const country = options.countryCode;
  const year = options.year;
  const cData = data[country][year];
  const timestamps = {}; // unix timestamps values within the data set
  const noCO2 = {};
  const lowCO2 = {};
  const isCO2 = {};
  const trinity = {
    noCO2: noCO2,
    lowCO2: lowCO2,
    isCO2: isCO2,
  };

  // timestamps
  timestamps["unix_seconds"] = cData["unix_seconds"]; // show the user date and time during the show
  // noCO2 pv wind
  if (cData["Solar"] !== undefined) noCO2["Solar"] = cData["Solar"];
  if (cData["Wind_onshore"] !== undefined)
    noCO2["Wind_onshore"] = cData["Wind_onshore"];
  if (cData["Wind_offshore"] !== undefined)
    noCO2["Wind_offshore"] = cData["Wind_offshore"];
  if (cData["Other_renewables"] !== undefined)
    noCO2["Other_renewables"] = cData["Other_renewables"];
  // lowCO2 nukes water bio geo
  if (cData["Nuclear"] !== undefined) lowCO2["Nuclear"] = cData["Nuclear"];
  if (cData["Biomass"] !== undefined) lowCO2["Biomass"] = cData["Biomass"];
  if (cData["Hydro_Run_of_River"] !== undefined)
    lowCO2["Hydro_Run_of_River"] = cData["Hydro_Run_of_River"];
  if (cData["Hydro_pumped_storage"] !== undefined)
    lowCO2["Hydro_pumped_storage"] = cData["Hydro_pumped_storage"];
  if (cData["Hydro_water_reservoir"] !== undefined)
    lowCO2["Hydro_water_reservoir"] = cData["Hydro_water_reservoir"];
  if (cData["Geothermal"] !== undefined)
    lowCO2["Geothermal"] = cData["Geothermal"];
  // isCO2 coal oil gas
  if (cData["Fossil_brown_coal___lignite"] !== undefined)
    isCO2["Fossil_brown_coal___lignite"] = cData["Fossil_brown_coal___lignite"];
  if (cData["Fossil_hard_coal"] !== undefined)
    isCO2["Fossil_hard_coal"] = cData["Fossil_hard_coal"];
  if (cData["Fossil_coal_derived_gas"] !== undefined)
    isCO2["Fossil_coal_derived_gas"] = cData["Fossil_coal_derived_gas"];
  if (cData["Fossil_oil"] !== undefined)
    isCO2["Fossil_oil"] = cData["Fossil_oil"];
  if (cData["Fossil_gas"] !== undefined)
    isCO2["Fossil_gas"] = cData["Fossil_gas"];
  if (cData["Waste"] !== undefined) isCO2["Waste"] = cData["Waste"];
  if (cData["Fossil_peat"] !== undefined)
    isCO2["Fossil_peat"] = cData["Fossil_peat"];
  if (cData["Fossil_oil_shale"] !== undefined)
    isCO2["Fossil_oil_shale"] = cData["Fossil_oil_shale"];

  return {
    trinity: trinity, // prod types assigned to on of three CO2 groups
    timestamps: timestamps, // unix date timestamps
    cData: cData,
  };
}

function buildManualSliderFromMax() {
  let arrayLen = getMaxDataSet();
  const spanHourly = document.getElementById("spanHourly");
  const isIdxHourly = spanHourly.dataset.value;
  if (isIdxHourly === "true") arrayLen = getMinDataSet();
  createManualSlider(arrayLen);
}

function getMinDataSet() {
  // if not hourly
  let minLen = [];
  Object.keys(frameControl).map((keyName) => {
    minLen.push(frameControl[keyName].instance.unixSeconds.length);
  });
  return Math.min(...minLen);
}

function getMaxDataSet() {
  // if not hourly
  // 'frameControl' in animation.js hosts the instances that calcs and draws
  let maxLen = 0;
  Object.keys(frameControl).map((keyName) => {
    const len = frameControl[keyName].instance.unixSeconds.length;
    if (len > maxLen) maxLen = len;
  });
  return maxLen;
}

/**
 *
 * @param {Number} maxLen
 */
function createManualSlider(maxLen) {
  manuSlider.setAttribute("max", maxLen - 1);
  //
  manuSlider.addEventListener("input", () => {
    Object.keys(frameControl).map((keyName) => {
      // all instances must wrtite coords before printing once, to eStorage.plotMix
      const idxStep = frameControl[keyName].idxStep;
      const sliderVal = parseInt(manuSlider.value);
      if (idxStep === 1) frameControl[keyName].instance.idx = sliderVal;
      if (idxStep > 1) frameControl[keyName].instance.idx = sliderVal * idxStep;

      frameControl[keyName].instance.update();
    });
    plotter({
      instancesData: eStore.plotMix,
      plotIdx: eStore.plotIdx,
      cx: eStore.canvasAntiClock.width / 2,
      cy: eStore.canvasAntiClock.height / 2,
      ctx: eStore.antiClockCtx,
      canvas: eStore.canvasAntiClock,
    });
  });
}

function getIndexStepHourly(options = {}) {
  // how many steps to skip to get only full hours displayed
  // to sync display countryA full hours and countryB 0,15,30,45
  // find first data set with 0, count next as long not 0 again
  const inst = options.instance;
  let count = 0;
  let idxStep = 0;

  inst.unixSeconds.slice(0).map((timestamp, _, array) => {
    const isoDate = getDateParts(timestamp);
    const isoMinute = Math.floor(isoDate.minute); // get int
    if (isoMinute === 0 && count > 0) {
      array.splice(1); // del sliced array copy; map() runs till end of []
      idxStep = count;
    }
    if (isoMinute === 0 && count === 0) count = 1; // found full
    if (isoMinute > 0) count += 1;
  });
  return idxStep;
}