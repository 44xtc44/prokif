
.. image:: https://github\.com/44xtc44/prokif/actions/workflows/node\.js\.yml/badge.svg?branch=dev
          :target: https://github\.com/44xtc44/prokif/actions/workflows/node\.js\.yml/badge.svg?branch=dev
          :alt: Tests


PROKIF - Projekt Kraftwerksinformationen
=========================================

Overview
---------
JS Fullstack. This repository shows the source code of a ternary plot diagram analysis tool. 
Compare german fidget current (Zappelstrom) over the years and with other countries.
Data sets are pulled from german Fraunhofer Institut Api https://api.energy-charts.info and stored locally
in the browsers inbuild IndexedDB. Visit the Fraunhofer Institut web site https://energy-charts.info/

Node.js download (all browser): https://www.npmjs.com/package/prokif

FireFox Android/PC Add-on: https://addons.mozilla.org/en-US/firefox/addon/prokif/

ReadTheDocs (Python based): https://prokif.readthedocs.io/en/latest/README.html

Pictures
--------
.. image:: ./compare_three_countries.png
            :alt: compare three countries
            :class: with-border
            :height: 2828

-

.. image:: ./trade_2023.png
            :alt: trade 2023
            :class: with-border
            :height: 676

- Is trade data for 2024 *interpreted* before uploaded to database?

.. image:: ./trade_2024.png
            :alt: trade 2024
            :class: with-border
            :height: 676

Why
---

A YouTube video from energieinfo https://www.youtube.com/@energieinfo21 channel shared ternary plot diagrams to explain energy production in Germany. 
Shown as the ratios of three production types positioned in an equilateral triangle.

The video is presented in german language, activate auto-translation. https://www.youtube.com/watch?v=I5jSOHP5VQw&t=205s

I decided to learn how ternary plot diagrams work in detail and automated the process of data visualization.
Now everyone can compare energy production strategies within Europe between different countries or years.

This application could provide additional interesting information to energy day traders, if further developed. 
(forecasts based on over the years patterns and trade volumes)

Browser Add-on Android/PC
--------------------------
Use the FireFox Add-on manager to locate ``prokif``. 

Uninstall Browser Add-on
------------------------
Remove the Add-on. ``All downloaded data are lost then``.

NPM Installation
-----------------
Install the latest Node.js interpreter software so you can run JavaScript directly on your OS.

Install this package *global* to get the executable ``prokif``.

    foobar:~$ npm install prokif -g

Install this package *global* from the developer source repository on GitHub.


    foobar:~$ npm install git+https://github.com/44xtc44/prokif.git -g

Why install with global flag?
The npm manager will create a binary file in its directory for your OS which automatically
launches the package if you type *prokif*. 
Else you must *cd /node_modules/prokif* and run the *node index.js* manually.

Usage
-----

User Interface (UI)
^^^^^^^^^^^^^^^^^^^^

Start the package. You will see a Frontend (browser) and Backend (express server).

Local HTTP express server provides the browser page and is proxy
for the external database request to german Fraunhofer Institut API.

Server listens on http://localhost:8001. You can connect
every browser to this local address. As long as server is up and running. 
This server component is not needed nor used in the Browser Add-on.

Start the package auto executable.

    foobar:~$ prokif

    server on 8001


The *local* start from inside the package directory. 
Scenario; download connection shows an error, no data is received.

    foobar:~$ cd node_modules/prokif
    foobar:~$ node index.js

    server on 8001
    
    url:  Denmark 2015 https://api.energy-charts.info/public_power?country=dk&start=2015-01-01&end=2015-12-31
    
    url:  Azerbaijan 2015 https://api.energy-charts.info/public_power?country=az&start=2015-01-01&end=2015-12-31
    ->error  Azerbaijan 2015 No data for https://api.energy-charts.info/public_power?country=az&start=2015-01-01&end=2015-12-31

Uninstall
------------

    foobar:~$ npm uninstall prokif -g

check the location and removal

    foobar:~$ npm list -g


How it works
-------------
The Browser extension, NPM package will connect to german Fraunhofer Institut 
to download JSON data files `api.energy-charts.info <https://api.energy-charts.info>`_.

Open an issue at the GitHub repo to request additional energy API or pulling from german energy ministry original database.

JSON is parsed, column names are cleaned for storage in browsers IndexedDB database.
You can download data for a whole year per country. Open an issue at the GitHub repo to request more granually downloads.
PC user can hit F12 to visit their data (FireFox 'web storage', Chrome 'Application' - IndexedDB).

All data are permanently stored in the browser's IndexedDB. Until browser cache clean-up. 

User setting are stored also in the IndexedDB to survive HTML page reloads and browser closings.

Select up to 10 countries or 10 years within a country to compare production behaviour.

The diagram is an SVG image on canvas with an overlay of calculated triangle boundaries.
The data is preconfigured to match one of three categories. The proportion of the categories is displayed.

Trade volumes are displayed in the same manner. So you can use the data *only* for countries with higher volatility in production processes.
Open an issue at the GitHub repo to request more granually display for *all* countries.


HowTo PC
--------
Clone repo from GitHub. Go to it,
install node.js and activate npm, red from package.json. 

    foobar:~$ npm install

FireFox 'about:debugging', and 'this FireFox' select a new temporary Add-on.

Open the manifest.json in the cloned folder and then start the Add-on from the puzzle icon list.

HowTo Android
--------------
Clone repo from GitHub. Go to it,
install node.js and activate npm, red from package.json. 

    foobar:~$ npm install

Install 'web-ext' "https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/".

Install Android Studio latest and create a dummy project. The device manager is needed to run a Android Virtual Device (AVD).

You then want to download the FireFox apk file and drag it onto the AVD. 
Search "Firefox Nightly for Developers". If you find 'APKmirror' save, go there. Else use the registration
process to enable PlayStore to pull FireFox Nightly, into every AVD.


**NOTE:** Deinstall FireFox 'regular' version, if any.

Open a terminal in the root of the repo clone, to load the Add-on into the AVD via USB.

    @lab42$ adb devices -l
    List of devices attached
    emulator-5554   offline

    @lab42$ web-ext run --target=firefox-android --android-device emulator-5554 --firefox-apk org.mozilla.fenix

The AVD and FireFox Nightly must be USB enabled (Dev mode) then.

Drag some media files into 'Device Explorer' in 'Android Studio'. Use 'mnt/sdcard/Music', to see it in user view on AVD.

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