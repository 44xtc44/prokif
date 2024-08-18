// menuCountrySelectors.js
"use strict";

/**
 * Country selector list of stacked div elements.
 * Enables download data sets from JSON API.
 * Foldable list is created dynamically from 
 * 2015 to current year.
 */
function createCountrySelectors() {
  const countrySelector = eStore.countrySelector;
  const parentId = "divCountryList";
  const maxCountries = eStore.maxCountries;

  Object.keys(countryCodes).forEach((country) => {
    const childId = country;

    appendDiv({
      parentId: document.getElementById(parentId),
      childId: childId,
      innerText: countryCodes[country], // long name parent label
      elemClass: "divCountries",
    });
    parentLabelAddListenerFolded({ country: country, childId: childId });

    Object.keys(eStore.year).forEach((yNum) => {
      createSubLabel({
        countrySelector: countrySelector,
        parentId: parentId,
        childId: childId,
        maxCountries: maxCountries,
        country: country,
        yNum: yNum,
      });
    });
  });
  appendDiv({
    // close option
    parentId: document.getElementById(parentId),
    childId: "closeCountryList",
    innerHTML: "<span class='handCursor' style='text-align:end;'>✖</span>",
    elemClass: "divCountries",
  });
}

/**
 * Sub label gets an listener to 
 * download data or pull from local DB.
 * Current year has an extra button to 
 * fetch the latest data since yesterday.
 * @param {Object} options options = {}
 * @param {Array} options.countrySelector list to push to until maxCountries
 * @param {number} options.maxCountries max num countries
 * @param {number} options.yNum year
 * @param {string} options.parentId parent div to appendChild
 * @param {string} options.childId child div
 * @param {string} options.country country
 */
function createSubLabel(options = {}) {
  const countrySelector = options.countrySelector;
  const maxCountries = options.maxCountries;
  const yNum = options.yNum;
  const parentId = options.parentId;
  const childId = options.childId;
  const country = options.country;
  const thisYear = new Date().getFullYear();
  const subChildId = childId.concat("::", yNum);
  const countryYear = "divCountryYear".concat("::", country);
  appendDiv({
    parentId: document.getElementById(parentId),
    childId: subChildId,
    innerText: country.concat(" ", yNum), // short code + year label
    elemClass: countryYear,
  });
  const subChild = document.getElementById(subChildId);
  subChild.classList.add("divCountries");
  if (thisYear == yNum) {
    const btn = document.createElement("button");
    btn.classList.add("fakeButton"); // idea was a styled div, now a real button ;)
    const span = document.createElement("span");
    span.appendChild(btn);
    subChild.append(span);
    btn.style.marginLeft = "10px";
    btn.innerText = "download";
    span.style.verticalAlign = "middle";
    subChild.dataset.value = false; // for nw request option
    btn.addEventListener("click", () => (subChild.dataset.value = true));
  }

  const yearCodeId = childId.concat("::", yNum);
  const yearCodeEl = document.getElementById(yearCodeId);
  yearCodeEl.style.display = "none";
  subLabelAddListenerPullData({
    yearCodeId: yearCodeId,
    yearCodeEl: yearCodeEl,
    countrySelector: countrySelector,
    parentId: parentId,
    childId: childId,
    maxCountries: maxCountries,
    country: country,
    yNum: yNum,
  });
}

/**
 * Sub label gets an listener to 
 * download data or pull from local DB.
 * @param {Object} options options = {}
 * @param {Array} options.countrySelector list to push to until maxCountries
 * @param {number} options.maxCountries max num countries
 * @param {number} options.yNum year
 * @param {string} options.country country
 * @param {string} options.yearCodeId div id
 * @param {HTMLElement} options.yearCodeEl div element
 */
function subLabelAddListenerPullData(options = {}) {
  const countrySelector = options.countrySelector;
  const maxCountries = options.maxCountries;
  const yNum = options.yNum;
  const country = options.country;
  const yearCodeId = options.yearCodeId;
  const yearCodeEl = options.yearCodeEl;

  yearCodeEl.addEventListener("click", () => {
    // event listener
    if (countrySelector.length >= maxCountries) return;
    if (countrySelector.includes(yearCodeId)) return; // already selected

    yearCodeEl.style.backgroundColor = "#6261cc";
    yearCodeEl.style.color = "#ffffff";

    yearCodeEl.innerHTML = "<span class='loader'></span>";

    const useProxy = document.getElementById("useProxy").dataset.value;
    if (useProxy === "true") {
      console.log("pickDataSetAsPacckage ->");
      // send url as string to node express, get JSON file back
      pickDataSetAsPackage({
        cCode: country,
        year: yNum,
      })
        .then(() => {
          countrySelector.push(yearCodeId);
          yearCodeEl.innerText = "OK - data ".concat(yearCodeId);
        })
        .catch(() => {
          yearCodeEl.innerText = "Fail - no data ".concat(yearCodeId);
        });
    } else {
      pickDataSet({
        // get data via browser extension
        cCode: country,
        year: yNum,
      })
        .then(() => {
          countrySelector.push(yearCodeId);
          yearCodeEl.innerText = "OK - data ".concat(yearCodeId);
        })
        .catch(() => {
          yearCodeEl.innerText = "Fail - no data ".concat(yearCodeId);
        });
    }
  });
}

/**
 * Parent label gets a listener to fold it.
 * @param {Object} options options = {}
 * @param {string} options.childId div id
 * @param {string} options.country country
 */
function parentLabelAddListenerFolded(options = {}) {
  const country = options.country;
  const childId = options.childId;
  const countryLabel = document.getElementById(childId);

  countryLabel.addEventListener("click", () => {
    const countryYear = "divCountryYear".concat("::", country);
    if (isCountryBtnFolded[country] === undefined)
      isCountryBtnFolded[country] = false;

    const ctrMember = document.getElementsByClassName(countryYear);

    if (!isCountryBtnFolded[country]) {
      isCountryBtnFolded[country] = true;
      countryLabel.style.backgroundColor = "#6261cc";
      countryLabel.style.color = "#ffffff";
      Object.values(ctrMember).map((member) => {
        document.getElementById(member.id).style.display = "block";
      });
    } else {
      isCountryBtnFolded[country] = false;
      countryLabel.style.backgroundColor = "#352b35";
      Object.values(ctrMember).map((member) => {
        document.getElementById(member.id).style.display = "none";
      });
    }
  });
}
