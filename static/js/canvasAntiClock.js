// canvasAntiClock.js
"use strict";

/**
 * Eventually draw the SVG triangle to canvas.
 * @param {*} options options = {}
 * @param {string} options.injectorId div id
 * @param {string} options.url local path to SVG
 */
function createTernaryPlot(options = {}) {
  fetchAnimationSVG({
    injectorId: options.injectorId,
    url: options.url,
  }).then((svgDomElement) => {
    drawSvgCanvas({
      svgDomElement: svgDomElement,
      scale: options.scale,
      canvas: options.canvas,
    });
  });
}

/**
 * Load an SVG image and inject it into a div.
 * Now we can access all of the internal paths and groups.
 * This is not fully used in this app. Else cartoon style animation.
 * @param {Object} options options = {}
 * @param {string} options.injectorId div id
 * @param {string} options.url local path to SVG
 * @returns {Promise} the injected SVG 'text' as DOM elem with an id
 * @example
 * fetchAnimationSVG({
 *  injectorId: "divTriangleAntiClock",
 *  url: "images/Ternary-plot-anti.svg"
 * })
 */
function fetchAnimationSVG(options = {}) {
  // can not reuse due to promise
  const div = document.getElementById(options.injectorId);
  const url = options.url;
  return new Promise((resolve) => {
    fetch(url, {
      method: "GET",
      headers: { "content-type": "image/svg+xml" },
    })
      .then((response) => response.text()) // need DOM element
      .then((text) => {
        div.innerHTML = text;
        resolve(div.children[0]); // the SVG DOM element
      });
  });
}

/**
 * SVG image converted to base64 drawn on canvas.
 * @param {*} options options = {}
 * @param {*} options.scale to adapt to device display size
 * @param {*} options.canvas named display area
 * @returns {{Object}} choosen canvas and context
 */
async function drawSvgCanvas(options = {}) {
  const svg = options.svgDomElement;
  svg.setAttribute("transform", options.scale); // SVG needs transform scale, not width

  const canvas = options.canvas;
  const ctx = canvas.getContext("2d");
  const base64Img = await svg2img64(svg);

  const img = new Image();
  img.onload = () => {
    const nW = img.naturalWidth;
    const nH = img.naturalHeight;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const cpX = cx - nW / 2;
    const cpY = cy - nH / 2;

    ctx.drawImage(img, cpX, cpY); // draw DOM el on canvas

    // must snapshot img in onload, else not sure drawing finished
    eStore.canvasImgAntiClock = ctx.getImageData(
      // [Todo] in options
      0,
      0,
      canvas.width,
      canvas.height
    );
  };
  img.src = base64Img;
  svg.style.display = "none"; // hide DOM el
  return { canvas: canvas, ctx: ctx };
}

/**
 * SVG to base64. (avoids PNG)
 * One shot conversion to paint complicated SVG content. Needs an animation "overlay". If any.
 * SVGtoCanvas class, on the other hand, can edit the paths without the need to convert to base64.
 * SVGtoCanvas direct draw. But fails to paint blur and gradients.
 * GhettoRecorder has Python base64 conversion for background image in browser.
 * @param {SVGImageElement} svg
 * @returns {Promise} base64 image as background for the calculated triangle.
 */
function svg2img64(svg) {
  return new Promise((resolve) => {
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = btoa(unescape(encodeURIComponent(xml))); // utf8 , other use btoa(xml);
    const head = "data:image/svg+xml;base64,";
    const image64 = head + svg64;
    resolve(image64);
  });
}

/**
 * Print a translucent image to the user download folder.
 */
function grabPngCanvas() {
  const canvas = document.getElementById("canvasAntiClock");
  // Convert the canvas to data
  const image = canvas.toDataURL();
  // Create a link
  const aDownloadLink = document.createElement("a");
  // Add the name of the file to the link
  aDownloadLink.download = "ternary_plot.png";
  // Attach the data to the link
  aDownloadLink.href = image;
  // Get the code to click the download link
  aDownloadLink.click();
}
/**
 * Adapt screen size to different devices.
 * @param {Object} options options = {}
 * @param {boolean} options.fromLayoutLarge y/n
 */
function resizePage(options = {}) {
  // divColumnThree  canvasAntiClock canvasClock
  const layoutBig = eStore.canvasClassAntiClockLarge;
  const layoutSmall = eStore.canvasClassAntiClockSmall;

  if (options.fromLayoutLarge) {
    const clsMembers = document.getElementsByClassName(layoutBig);
    const mover = [...clsMembers];
    mover.map((member) => {
      member.classList.remove(layoutBig);
      member.classList.add(layoutSmall);
    });
    document.getElementById("canvasClock").width = eStore.canvasWidthClockSmall;
    document.getElementById("canvasClock").height =
      eStore.canvasWidthClockSmall;
    document.getElementById("canvasAntiClock").width =
      eStore.canvasWidthAntiClockSmall;
    document.getElementById("canvasAntiClock").height =
      eStore.canvasWidthAntiClockSmall;
    createTernaryPlot({
      injectorId: "divTriangleAntiClock",
      url: "images/Ternary-plot-anti.svg",
      scale: eStore.canvasScaleAntiClockSmall,
      canvas: document.getElementById("canvasAntiClock"),
    });
  }

  if (!options.fromLayoutLarge) {
    const clsMembers = document.getElementsByClassName(layoutSmall);
    const mover = [...clsMembers];
    mover.map((member) => {
      member.classList.remove(layoutSmall);
      member.classList.add(layoutBig);
    });
    document.getElementById("canvasClock").width = eStore.canvasWidthClockLarge;
    document.getElementById("canvasClock").height =
      eStore.canvasWidthClockLarge;
    document.getElementById("canvasAntiClock").width =
      eStore.canvasWidthAntiClockLarge;
    document.getElementById("canvasAntiClock").height =
      eStore.canvasWidthAntiClockLarge;
    createTernaryPlot({
      injectorId: "divTriangleAntiClock",
      url: "images/Ternary-plot-anti.svg",
      scale: eStore.canvasScaleAntiClockLarge,
      canvas: document.getElementById("canvasAntiClock"),
    });
  }
  reseizeTriangle({
    id: "ternaryPlotAntiClock", // triangle only visible in dev mode
    // boundaries for the diagram intersection points
    side: eStore.useLargeLayout ? eStore.triangleLarge : eStore.triangleSmall,
    precision: 100, // for option drawing show, how many parts one side consists of
    clockwise: false,
  });
}

/**
 * Dispatcher small, big screen.
 */
function updateScreen() {
  if (window.innerWidth < 600) {
    resizePage({ fromLayoutLarge: true });
    eStore.useLargeLayout = false;
  }

  if (window.innerWidth >= 600) {
    resizePage({ fromLayoutLarge: false });
    eStore.useLargeLayout = true;
  }
}
