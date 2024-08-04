// index.js

/* Documentation setup with Python sphinx-js package
 *
 * https://test-builds.readthedocs.io/en/jsdoc-autoapi/
 * https://pypi.org/project/sphinx-js/
 */
/**
 * Browser extension for PC and Android
 * @author 'www.github.com/44xtc44'
 * @version 1.0
 * @since 1.0
 * @see license {Apache 2.0 License (2024), René Horn}
 */

"use strict";

// http://acl.digimat.in/nptel/courses/video/113104068/L45.html

/**
 * What? Ternary Phase Diagram. Animation for presentations.
 * Why? A YouTube video https://www.youtube.com/watch?v=I5jSOHP5VQw&t=205s
 * on 'energieinfo' channel. He made a movie clip (best) 'manually' from it.
 *
 * What to do?
 * Vanilla JS "draws" invisible paths to calc the intersection in a
 * triangle for "three data results" from DB queries or arrays.
 * https://en.wikipedia.org/wiki/Ternary_plot
 *
 * This has nothing to do with the rulers painted on the triangle
 * for better readability, IN THE first place. Those rulers will be
 * also animated later to show how to read this stuff.
 * Can be used for education. Compare manual findings with calculated.

 *
 * MYSTERIES OF THE EQUILATERAL TRIANGLE Brian J. McCartin
 * Applied Mathematics Kettering University
 *         C
 *        /\
 *       /  \  M is center of circle inside, also of triangle
 *      /    \
 *     /   M  \
 *  A /________\ B
 * corner layout, source chapter 2: b) Hopkins [185]
 * Need a clean path to read the massive side coords
 * into the correct side storage object. Sides interact with each other.
 *
 * Also, there are two opposite ways to read the ternary thingy diagram.
 * Should implement clockwise, anti-clockwise.
 *
 * Anti-clock: https://www.youtube.com/watch?v=fyJOEGTcHSM  00:07:30
 * clockwise: https://www.youtube.com/watch?v=SG_8u6_UMTA
 *
 * https://stackoverflow.com/questions/58213344/rotate-a-triangle-in-the-cente-of-itself
 */
function docuPlaceholder() {
  // Able to write above comments into Python sphinx doc module, for webhook readthedocs.io, at first.
}
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