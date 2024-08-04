PROKIF - Projekt Kraftwerksinformationen
=========================================

Overview
---------
This repository shows the source code of a ternary plot diagram fullstack software written in JavaScript.
It can be used to analyse energy production data within Europe.

Node.js download: https://www.npmjs.com/package/prokif

FireFox Android/PC Add-on: https://addons.mozilla.org/en-US/firefox/addon/prokif/

ReadTheDocs (Python based): https://prokif.readthedocs.io/en/latest/README.html

Why
---

A random YouTube video shared ternary plot diagrams to explain energy production in Germany. 
Shown as the ratios of three production types positioned in an equilateral triangle.

I decided to learn how ternary plot diagrams work in detail and automated the creation for this special case.

The video is presented in german language, activate auto-translation. https://www.youtube.com/watch?v=I5jSOHP5VQw&t=205s

How it works
-------------

The Browser extension, NPM package will connect to german Fraunhofer Institut 
to download raw data (www.energy-charts.info).
PC user can hit F12 to visit their data (FireFox 'web storage', Chrome 'Application' - IndexedDB).

All data are permanently stored in the browser's IndexedDB. Until browser cache clean-up. 

User setting are stored also in the IndexedDB to survive HTML page reloads and browser closings.

Select up to 10 countries or 10 years within a country to compare production behaviour.

The diagram is an SVG image on canvas with an overlay of calculated triangle boundaries. 


HowTo PC
--------
Clone the repo. 

FireFox 'about:debugging', and 'this FireFox' select a new temporary Add-on.

Open the manifest.json inside the cloned repo and then start the Add-on from the puzzle icon list.

HowTo Android
--------------
Clone the repo. 

Install 'web-ext' "https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/".

Install Android Studio latest and create a dummy project. The device manager is needed to run a Android Virtual Device (AVD).

You then want to download the FireFox apk file and drag it onto the AVD. 
Search "Firefox Nightly for Developers". If you find 'APKmirror' save, go there. Else use the registration
process to enable PlayStore to pull FireFox Nightly, into every AVD.

.. note::
    Deinstall FireFox 'regular' version, if any.

Open a terminal in the root of the repo clone, to load the Add-on into the AVD via USB.

.. code-block:: console

    @host$ adb devices -l
    List of devices attached
    emulator-5554   offline

    @host$ web-ext run --target=firefox-android --android-device emulator-5554 --firefox-apk org.mozilla.fenix

The AVD and FireFox Nightly must be USB enabled (Dev mode) then.

Known issues
-------------

Contributions
-------------

Pull requests are welcome.
If you want to make a major change, open an issue first to have a short discuss.


Thank you
----------
energieinfo https://www.youtube.com/@energieinfo21

License
-------
Apache 2.0 License