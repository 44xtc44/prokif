// dataPlayground.js
"use strict";

/**
 * HTML elements to an info card of selected data (online)
 * and claculated data (we).
 */
function createInfocards() {
  const dashBoard = document.getElementById("rowDataDisplay");
  const format = "column200";

  for (let idx = 1; idx <= eStore.maxCountries; idx++) {
    const infoCard = document.createElement("div");
    infoCard.setAttribute("id", "divInfoCard__".concat(idx.toString()));
    infoCard.classList.add(format);
    dashBoard.appendChild(infoCard);
    infoCardItems.map((idString) => {
      const row = document.createElement("div");
      row.setAttribute("id", idString.concat(idx.toString()));
      infoCard.appendChild(row);
    });
  }
}