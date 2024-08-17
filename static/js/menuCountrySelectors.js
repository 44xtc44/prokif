// menuCountrySelectors.js
"use strict";

/**
 * Country selector list.
 * Enables download data sets from JSON API. 
 */
function createCountrySelectors() {
  // countryCodes
  const countrySelector = eStore.countrySelector;
  const parentId = "divCountryList";
  const maxCountries = eStore.maxCountries;

  Object.keys(countryCodes).forEach((country) => {
    const childId = country;

    appendDiv({
      parentId: document.getElementById(parentId),
      childId: childId,
      innerText: countryCodes[country], // long name label
      elemClass: "divCountries",
    });

    Object.keys(eStore.year).forEach((yNum) => {
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
          // not mix up here, already a mess -> refac
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
    });
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
  });
  appendDiv({
    parentId: document.getElementById(parentId),
    childId: "closeCountryList",
    innerHTML: "<span class='handCursor' style='text-align:end;'>✖</span>",
    elemClass: "divCountries",
  });
}
