// dataIdbRestoreUserState.js
"use strict";

function restoreUserSettings(dataResult) {
  // restore if other than default
  document.getElementById("sliderFps").value = dataResult.sliderFps;

  if (dataResult.autoButton === false) {
    document.getElementById("imgAutoPlay").src = "images/switch-off.svg";
    document.getElementById("spanAutoPlay").dataset.value = "false";
    document.getElementById("divFps").style.display = "none";
    document.getElementById("btnStartDataAnimation").style.visibility =
      "hidden";
    document.getElementById("divManualUpdate").style.display = "block";
    document.getElementById("btnStartDataAnimation").value = true;
    document.getElementById("btnStartDataAnimation").innerText = "start";
  }

  if (dataResult.hoursButton === false) {
    document.getElementById("imgIdxStepHourly").src = "images/switch-off.svg";
    document.getElementById("spanHourly").dataset.value = "false";
  }
  if (dataResult.syncButton === false) {
    document.getElementById("imgSyncWeekday").src = "images/switch-off.svg";
    document.getElementById("spanSyncWeekday").dataset.value = "false";
  }
  if (dataResult.tradeButton === true) {
    document.getElementById("imgShowTrade").src = "images/switch-on.svg";
    document.getElementById("spanShowTrade").dataset.value = "true";
    document.getElementById("divOnlineSelection").style.display = "none";
  }
}
