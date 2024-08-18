JS docs
========

animation.js
-----------------------
.. js:autofunction:: animationMain

background.js
-----------------------
* Starter script for browser extension

constants.js
-----------------------

   * global constants

canvasAntiClock.js
-----------------------
.. js:autofunction:: createTernaryPlot
.. js:autofunction:: fetchAnimationSVG
.. js:autofunction:: drawSvgCanvas
.. js:autofunction:: svg2img64
.. js:autofunction:: grabPngCanvas
.. js:autofunction:: resizePage
.. js:autofunction:: updateScreen

dataFetch.js
-----------------------
.. js:autofunction:: pullStoreJson
.. js:autofunction:: getApiData
.. js:autofunction:: getData
.. js:autofunction:: postData
.. js:autofunction:: prepIndexedDbStorage
.. js:autofunction:: adaptDataColHeader
.. js:autofunction:: updateIndexDbCountry

dataIdbCreate.js
-----------------------
.. js:autofunction:: initIndexDb
.. js:autofunction:: createCountryDB
.. js:autofunction:: createUserSettingsDB

dataIdbRestoreUserState.js
----------------------------
.. js:autofunction:: restoreUserSettings

dataIdbSetGet.js
----------------------------
.. js:autofunction:: setIdbValue
.. js:autofunction:: getIdbValue

dataPlayground.js
----------------------------
.. js:autofunction:: createInfocards

dataTernaryPlotCalc.js
----------------------------
.. js:autofunction:: getIntersection
.. js:autofunction:: prodTypeValues
.. js:autofunction:: adjustPlotTrails
.. js:autofunction:: updateInfoCardMeta
.. js:autofunction:: updateInfoCardData
.. js:autofunction:: getPositionAlongTheLine
.. js:autofunction:: lineIntersection

.. js:autoclass:: EnergyStorage
.. js:autoclass:: EnergyMix
.. js:autoclass:: EnergyMix#update
.. js:autoclass:: EnergyMix#isDataValid
.. js:autoclass:: EnergyMix#tradeColors
.. js:autoclass:: EnergyMix#syncWeekday
.. js:autoclass:: EnergyMix#setPercentDist

dataTernaryPlotSetup.js
----------------------------
.. js:autofunction:: datahome
.. js:autofunction:: createTrinityFromClosure
.. js:autofunction:: buildManualSliderFromMax
.. js:autofunction:: getMinDataSet
.. js:autofunction:: getMaxDataSet
.. js:autofunction:: createManualSlider

dataTime.js
----------------------------
.. js:autofunction:: getDateParts
.. js:autofunction:: getYesterday

description.js
----------------------------
.. js:autofunction:: textColumnOne
.. js:autofunction:: textColumnTwo
.. js:autofunction:: textColumnTwoDotOne

index.js
-----------------------
 * Vanilla JS draws invisible paths to calc the intersection in a triangle for three data results from DB queries or arrays.
 
 * There are two opposite ways to read the ternary diagram.
 * Should implement clockwise, anti-clockwise.
 
 * Anti-clock, https://www.youtube.com/watch?v=fyJOEGTcHSM
 * Clockwise, https://www.youtube.com/watch?v=SG_8u6_UMTA,

menuCountrySelectors.js
----------------------------
.. js:autofunction:: createCountrySelectors
.. js:autofunction:: createSubLabel
.. js:autofunction:: subLabelAddListenerPullData
.. js:autofunction:: parentLabelAddListenerFolded

plot.js
----------------------------
.. js:autofunction:: plotter

selectRun.js
----------------------------
.. js:autofunction:: runShow
.. js:autofunction:: pickDataSet
.. js:autofunction:: pickDataSetAsPackage
.. js:autofunction:: getIndexStepHourly

setEventListener.js
----------------------------
.. js:autofunction:: setPageEventHandler
.. js:autofunction:: setMenuEventHandler
.. js:autofunction:: setBtnEventHandler
.. js:autofunction:: setCheckboxEventHandler

triangleCalc.js
----------------------------
.. js:autofunction:: reseizeTriangle
.. js:autofunction:: getCoords
.. js:autofunction:: createSideRuler

trianglePlot.js
----------------------------
.. js:autofunction:: intersect

utils.js
-----------------------
.. js:autofunction:: appendDiv
