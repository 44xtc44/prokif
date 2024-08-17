// setEventListener.js
"use strict";

/**
 * A 'x' knob to hide the settings buttons.
 */
function setPageEventHandler() {
  const settings = document.getElementById("divToggleSystemSettings");
  const divSystemSettings = document.getElementById("divSystemSettings");
  settings.addEventListener("click", () => {
    if (
      settings.dataset.value === "true" ||
      settings.dataset.value === undefined
    ) {
      divSystemSettings.style.display = "none";
      settings.dataset.value = false;
    } else {
      divSystemSettings.style.display = "block";
      settings.dataset.value = true;
    }
  });
}

/**
 * Top nav menu.
 */
function setMenuEventHandler() {
  const liCountries = document.getElementById("liCountries");
  const liDownload = document.getElementById("liDownload");
  const menuHome = document.getElementById("menuHome");
  const liGit = document.getElementById("liGit");
  const closeCountryList = document.getElementById("closeCountryList");

  liCountries.addEventListener("click", () => {
    const divCountryList = document.getElementById("divCountryList");
    if (
      divCountryList.dataset.isHidden === "true" ||
      divCountryList.dataset.isHidden === undefined
    ) {
      divCountryList.dataset.isHidden = false;
      divCountryList.style.display = "block";
    } else {
      divCountryList.dataset.isHidden = true;
      divCountryList.style.display = "none";
    }
  });

  menuHome.addEventListener("click", () => {
    // same as liCountries
    const divCountryList = document.getElementById("divCountryList");
    if (
      divCountryList.dataset.isHidden === "true" ||
      divCountryList.dataset.isHidden === undefined
    ) {
      divCountryList.dataset.isHidden = false;
      divCountryList.style.display = "block";
    } else {
      divCountryList.dataset.isHidden = true;
      divCountryList.style.display = "none";
    }
  });

  liDownload.addEventListener("click", () => {
    if (liDownload.dataset.isHidden === "true") {
      liDownload.dataset.isHidden = false;
      document.getElementById("divDownloadReport").style.display = "none";
    } else {
      liDownload.dataset.isHidden = true;
      liDownload.innerText = "Close Download Report";
      pullStoreJson();
    }
  });
  liGit.addEventListener("click", () =>
    window.open("https://github.com/44xtc44/prokif", "_blank")
  );
  closeCountryList.addEventListener("click", () => {
    divCountryList.style.display = "none";
    divCountryList.dataset.isHidden = true;
  });
}

/**
 * Buttons event handler.
 */
function setBtnEventHandler() {
  const btnStartDataAnimation = document.getElementById(
    "btnStartDataAnimation"
  );
  const btnResetPage = document.getElementById("btnResetPage");
  const btnTriCanvasPng = document.getElementById("btnTriCanvasPng");

  btnStartDataAnimation.addEventListener("click", () => {
    if (btnStartDataAnimation.value === "true") {
      btnStartDataAnimation.value = false;
      btnStartDataAnimation.innerText = "stop";
      animationMain();
    } else {
      btnStartDataAnimation.value = true;
      btnStartDataAnimation.innerText = "start";
      cancelAnimationFrame(animationFrameCount);
    }
  });
  btnResetPage.addEventListener("click", () => {
    location.reload(true);
  });
  btnTriCanvasPng.addEventListener("click", () => {
    grabPngCanvas();
  });
}

/**
 * Slider to change update time to show next data set.
 */
function setRangeFpsEventHandler() {
  const sliderFps = document.getElementById("sliderFps");
  const showSliderFps = document.getElementById("showSliderFps");
  sliderFps.addEventListener("input", () => {
    showSliderFps.innerText = ((1 / 60) * sliderFps.value).toFixed(2) + " sec ";
    setIdbValue({
      dbName: "prokif_user_settings",
      dbVersion: 1,
      objectStoreName: "state",
      id: "user_settings",
      updFields: { sliderFps: sliderFps.value }, // data row key:val incl. row name
    });
  });
}

/**
 * All checkboxes.
 */
function setCheckboxEventHandler() {
  const imgAutoPlay = document.getElementById("imgAutoPlay");
  const imgIdxStepHourly = document.getElementById("imgIdxStepHourly");
  const imgSyncWeekday = document.getElementById("imgSyncWeekday");
  const imgShowTrade = document.getElementById("imgShowTrade");

  imgAutoPlay.addEventListener("click", () => {
    const spanAutoPlay = document.getElementById("spanAutoPlay");
    const divFps = document.getElementById("divFps");
    const divManualUpdate = document.getElementById("divManualUpdate");
    const btnStartDataAnimation = document.getElementById(
      "btnStartDataAnimation"
    );

    if (spanAutoPlay.dataset.value === "true") {
      spanAutoPlay.dataset.value = false;
      imgAutoPlay.src = "images/switch-off.svg";
      divFps.style.display = "none";
      btnStartDataAnimation.value = false;
      btnStartDataAnimation.innerText = "stop";
      btnStartDataAnimation.style.visibility = "hidden";
      cancelAnimationFrame(animationFrameCount);
      divManualUpdate.style.display = "block";
      setIdbValue({
        dbName: "prokif_user_settings",
        dbVersion: 1,
        objectStoreName: "state",
        id: "user_settings",
        updFields: { autoButton: false },
      });
    } else {
      spanAutoPlay.dataset.value = true;
      imgAutoPlay.src = "images/switch-on.svg";
      divFps.style.display = "block";
      btnStartDataAnimation.style.visibility = "visible";
      divManualUpdate.style.display = "none";
      btnStartDataAnimation.value = true;
      btnStartDataAnimation.innerText = "start";
      setIdbValue({
        dbName: "prokif_user_settings",
        dbVersion: 1,
        objectStoreName: "state",
        id: "user_settings",
        updFields: { autoButton: true },
      });
    }
  });
  imgIdxStepHourly.addEventListener("click", () => {
    const spanHourly = document.getElementById("spanHourly");
    if (spanHourly.dataset.value === "true") {
      spanHourly.dataset.value = false;
      imgIdxStepHourly.src = "images/switch-off.svg";
      setIdbValue({
        dbName: "prokif_user_settings",
        dbVersion: 1,
        objectStoreName: "state",
        id: "user_settings",
        updFields: { hoursButton: false },
      });
    } else {
      spanHourly.dataset.value = true;
      imgIdxStepHourly.src = "images/switch-on.svg";
      setIdbValue({
        dbName: "prokif_user_settings",
        dbVersion: 1,
        objectStoreName: "state",
        id: "user_settings",
        updFields: { hoursButton: true },
      });
    }
  });
  imgSyncWeekday.addEventListener("click", () => {
    const spanSyncWeekday = document.getElementById("spanSyncWeekday");
    if (spanSyncWeekday.dataset.value === "true") {
      spanSyncWeekday.dataset.value = false;
      imgSyncWeekday.src = "images/switch-off.svg";
      setIdbValue({
        dbName: "prokif_user_settings",
        dbVersion: 1,
        objectStoreName: "state",
        id: "user_settings",
        updFields: { syncButton: false },
      });
    } else {
      spanSyncWeekday.dataset.value = true;
      imgSyncWeekday.src = "images/switch-on.svg";
      setIdbValue({
        dbName: "prokif_user_settings",
        dbVersion: 1,
        objectStoreName: "state",
        id: "user_settings",
        updFields: { syncButton: true },
      });
    }
  });
  imgShowTrade.addEventListener("click", () => {
    const spanShowTrade = document.getElementById("spanShowTrade");
    const divOnlineSelection = document.getElementById("divOnlineSelection");
    if (spanShowTrade.dataset.value === "true") {
      spanShowTrade.dataset.value = false;
      imgShowTrade.src = "images/switch-off.svg";
      divOnlineSelection.style.display = "block";
      setIdbValue({
        dbName: "prokif_user_settings",
        dbVersion: 1,
        objectStoreName: "state",
        id: "user_settings",
        updFields: { tradeButton: false },
      });
    } else {
      spanShowTrade.dataset.value = true;
      imgShowTrade.src = "images/switch-on.svg";
      divOnlineSelection.style.display = "none";
      setIdbValue({
        dbName: "prokif_user_settings",
        dbVersion: 1,
        objectStoreName: "state",
        id: "user_settings",
        updFields: { tradeButton: true },
      });
    }
  });
}
