// animation.js
"use strict";

/* THE one and only animation driver module. */

window.animationFrameCount = 0;  // Interpreter counter
const frameControl = {}; // hosts instances of EnergyMix class

/**
 * Any animation called here.
 * Runs on Browser refresh rate.
 */
function animationMain() {
  runIntro();
  runFrames();
  /* requestAnimationFrame; only one in an app. */
  animationFrameCount = requestAnimationFrame(animationMain);
}

/**
 * Start the few seconds intro animation.
 */
function runIntro() {
  if (!animateTriangle.isDrawn) {
    if (animationFrameCount % 2 === 0) animateTriangle.drawAllEdges();
  }
}

/**
 * Trigger all instance.update()s.
 * Display next row of stored data for all instances
 * in one shot, plotter.
 * Adjust display frequency real time, slider.
 * Frames are browser frames, usually 60fps.
 */
function runFrames() {
  const firstKey = Object.keys(frameControl);
  if (firstKey.length === 0) return;
  if (frameControl[firstKey[0]] === undefined) return;

  if (animationFrameCount % frameControl[firstKey[0]].fps === 0) {
    const sliderFps = document.getElementById("sliderFps");
    Object.keys(frameControl).map((keyName) => {
      // if 300 mod 60 = 0; updates each second, mod 1 each browser frame
      frameControl[keyName].fps = parseInt(sliderFps.value); // user sets frame rate
      frameControl[keyName].instance.idx += parseInt(
        frameControl[keyName].idxStep
      ); // skips minutes if>1
      frameControl[keyName].instance.update();
    });
    // console.log(eStore.plotMix);
    plotter({
      instancesData: eStore.plotMix,
      plotIdx: eStore.plotIdx,
      cx: eStore.canvasAntiClock.width / 2,
      cy: eStore.canvasAntiClock.height / 2,
      ctx: eStore.antiClockCtx,
      canvas: eStore.canvasAntiClock,
    });
  }
}
