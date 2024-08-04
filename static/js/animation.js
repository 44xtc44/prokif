// animation.js
"use strict";

window.animationFrameCount = 0;
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

function runIntro() {
  if (!animateTriangle.isDrawn) {
    if (animationFrameCount % 2 === 0) animateTriangle.drawAllEdges();
  }
}

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
