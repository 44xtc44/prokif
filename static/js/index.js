// index.js
"use strict";
/* Documentation setup with Python sphinx-js package
 *
 * https://test-builds.readthedocs.io/en/jsdoc-autoapi/
 * https://pypi.org/project/sphinx-js/
 * https://www.digitalocean.com/community/tutorials/linting-and-formatting-with-eslint-in-vs-code
 * http://acl.digimat.in/nptel/courses/video/113104068/L45.html
 */

/**
 * @author 44xtc44
 * @version 1.0
 * @since 1.0
 * @license Apache 2.0 License (2024), René Horn
 */

var module = module || {}; // if module export for test, prevents console error in browser
const isCountryBtnFolded = {}; // country main btn has unfolded year btns or not
var eStore = null; // helper for EnergyMix class
var animateTriangle = null; // instance of AnimateDrawTriangle
document.getElementById("divColumnOne").style.backgroundImage =
  "url('images/Ternary-intro.svg')";

window.addEventListener("load", () => {
  window.addEventListener("resize", () => updateScreen());
  eStore = new EnergyStorage(); // single instance, then one EnergyMix instance for a country
  updateScreen();

  createUserSettingsDB();
  createCountryDB(); // DB schemas for data pull from fraunhofer api
  createCountrySelectors(); // stacked divs as selector with event listeners
  setMenuEventHandler();
  setBtnEventHandler();
  setCheckboxEventHandler();
  setRangeFpsEventHandler();
  setPageEventHandler();

  textColumnOne();
  textColumnTwo();
  textColumnTwoDotOne();
  // textColumnFive();
  createInfocards();

  const showKit = reseizeTriangle({
    id: "showTriangleClock",
    side: eStore.useLargeLayout
      ? eStore.triangleLarge / 2
      : eStore.triangleSmall / 2,
    precision: 100, // option for drawing show
    clockwise: true, // which canvas to use
  });
  animateTriangle = new AnimateDrawTriangle(showKit);
  animationMain();

  /**
   * DEV - visible for manual calibration. Length, edge points, of triangle within the SVG image.
   * --> The calculated and drawn triangle will be 'snapshoted' together with the SVG triangle image.
   * Which is not to avoid without effort. Comment out the functions.
   * Triangle 'edge coords'! are used for calculation of line intersections on the fly.
   */
  const buildKit = reseizeTriangle({
    id: "ternaryPlotAntiClock",
    side: eStore.useLargeLayout ? eStore.triangleLarge : eStore.triangleSmall,
    precision: 100, // option for drawing show
    clockwise: false, // which canvas to use
  });
  // drawTriangle(buildKit);
  // drawCircle(buildKit);
});
