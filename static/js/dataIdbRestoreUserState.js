// dataIdbRestoreUserState.js
"use strict";

/**
 * Restore setting if other than default.
 * @param {Object} stateDict 
 */
function restoreUserSettings(stateDict) {
  document.getElementById("sliderFps").value = stateDict.sliderFps;

  if (stateDict.autoButton === false) {
    document.getElementById("imgAutoPlay").src = "images/switch-off.svg";
    document.getElementById("spanAutoPlay").dataset.value = "false";
    document.getElementById("divFps").style.display = "none";
    document.getElementById("btnStartDataAnimation").style.visibility =
      "hidden";
    document.getElementById("divManualUpdate").style.display = "block";
    document.getElementById("btnStartDataAnimation").value = true;
    document.getElementById("btnStartDataAnimation").innerText = "start";
  }

  if (stateDict.hoursButton === false) {
    document.getElementById("imgIdxStepHourly").src = "images/switch-off.svg";
    document.getElementById("spanHourly").dataset.value = "false";
  }
  if (stateDict.syncButton === false) {
    document.getElementById("imgSyncWeekday").src = "images/switch-off.svg";
    document.getElementById("spanSyncWeekday").dataset.value = "false";
  }
  if (stateDict.tradeButton === true) {
    document.getElementById("imgShowTrade").src = "images/switch-on.svg";
    document.getElementById("spanShowTrade").dataset.value = "true";
    document.getElementById("divOnlineSelection").style.display = "none";
  }
}
