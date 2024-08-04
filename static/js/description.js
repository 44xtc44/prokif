// description.js
"use strict";

function textColumnOne() {
  const divColumnOne = document.getElementById("divColumnOne");
  divColumnOne.innerHTML = "<h1>A dynamic view on energy production</h1>";
}

function textColumnTwo() {
  const divColumnTwo = document.getElementById("divColumnTwo");
  const divHowTo = document.createElement("div");
  divHowTo.classList.add("column500");
  divColumnTwo.appendChild(divHowTo);
  divHowTo.innerHTML =
    "<h3>HowTo</h3>" +
    // https://en.wikipedia.org/wiki/Ternary_plot
    "<span class='txtDescription'>Switch <q>boxed</q> buttons <q>before</q> selecting country data sets. Max. value calc and index step must be announced. </span>" +
    "<span class='txtDescription'>Menubar <q>Countries</q>. Select 10 countries or 10 years to compare.</span>" +
    "<span class='txtDescription'>Find the trinary value at the upper left of a square. </span>" +
    "<span class='txtDescription'><q>auto</q> OFF reveals the manual slider. Jump to a specific date. <q>auto</q> from there. </span>" +
    "<span class='txtDescription'>Update slider means <q>real time</q> calculations every fraction of a second. " +
    "Will exclude some low end devices by nature. </span>" +
    "<span class='txtDescription'>Colors for trade volumes ​​were set arbitrarily. Green represents above zero. Full color above +- 5k. </span>" +
    "<span class='txtDescription'>Trade view makes sense for a country with volatile production, in this diagram. See manual slider. " +
    "There is nothing to be seen for Switzerland. Points are nearly in the same place. </span>" +
    "<span class='txtDescription'></span>" +
    "<span class='txtDescription'>Observe the country info card data sets below the button area. A big X means show/hide. </span>" +
    "<span class='txtDescription'>Refresh browser before selecting new country data.</span>" +
    "<span class='txtDescription'>The Browser extension will connect to german Fraunhofer Institut to download raw data (www.energy-charts.info). " +
    "Force download of fresh data (yesterday) for the current year by <q>download</q> button. All other data are permanently stored in the " +
    "browser's IndexedDB. PC user can hit F12 to visit their data (FireFox 'web storage', Chrome 'Application' - IndexedDB).</span>" +
    "<span class='txtDescription'>Data is not normalized (raw). Some countries, years suffer from bad quality, " +
    "i.e. Albania, Ukraine and UK no data 22 and 24. </span>" +
    "<span class='txtDescription'>The diagram is an image with an overlay of calculated triangle boundaries. </span>" +
    "<p><a href='https://www.youtube.com/watch?v=I5jSOHP5VQw'>Support the project idea giver energieinfo (a brave scientist) on YouTube</a></p>";
}

function textColumnTwoDotOne() {
  const divColumnTwo = document.getElementById("divColumnTwo");
  const divTechnical = document.createElement("div");
  divTechnical.classList.add("column500");
  divColumnTwo.appendChild(divTechnical);
  divTechnical.innerHTML =
    "<h3>Is this diagram suitable for you?</h3>" +
    "<span class='txtDescription'>Database data from multiple tables and columns are visual observable in one unit; aka <q>The big picture</q>. " +
    "Likewise, a custom SQL database view or chart analysis allows the management to detect pattern and extreme deviations.</span>" +
    "<span class='txtDescription'>An equilibrium will rarely show fluctuations. </span>" +
    "<span class='txtDescription'>If all compared systems are showing high fluctuations it could be a challenge to observe which one is more stable. </span>" +
    "<span class='txtDescription'>Energy production relevant Database arrays ([2.300,3.600,...]) are assigned to one of three categories. " +
    "An array represents a production output in GigaWatt, like Biomass, and belongs to only one category, like <q>Low CO2</q>, that shows " +
    "the summed amount of all sibling arrays in GigaWatt.</span>" +
    "<span class='txtDescription'>Since the total amount of all production output (GigaWatt) must be 100%, it is possible to calculate the " +
    "proportion for each category at a specific time.</span>" +
    "<span class='txtDescription'>Production categories used hereby are (A) <q>intermittent</q> aka PV and Wind, (B) <q>Low CO2 output</q>  " +
    "and (C) <q>Fossil; High CO2 output</q>.</span>" +
    "<span class='txtDescription'>(A) <q>intermittent</q></span>" +
    "<span class='bullitDescription'>Solar</span>" +
    "<span class='bullitDescription'>Wind_onshore</span>" +
    "<span class='bullitDescription'>Wind_offshore</span>" +
    "<span class='bullitDescription'>Other_renewables</span>" +
    "<span class='txtDescription'>(B) <q>Low CO2</q></span>" +
    "<span class='bullitDescription'>Nuclear</span>" +
    "<span class='bullitDescription'>Biomass</span>" +
    "<span class='bullitDescription'>Hydro_Run_of_River</span>" +
    "<span class='bullitDescription'>Hydro_pumped_storage</span>" +
    "<span class='bullitDescription'>Hydro_water_reservoir</span>" +
    "<span class='bullitDescription'>Geothermal</span>" +
    "<span class='txtDescription'>(C) <q>High CO2</q></span>" +
    "<span class='bullitDescription'>Fossil_brown_coal_lignite</span>" +
    "<span class='bullitDescription'>Fossil_peat</span>" +
    "<span class='bullitDescription'>Fossil_oil_shale</span>" +
    "<span class='bullitDescription'>Fossil_hard_coal</span>" +
    "<span class='bullitDescription'>Fossil_coal_derived_gas</span>" +
    "<span class='bullitDescription'>Fossil_oil</span>" +
    "<span class='bullitDescription'>Fossil_gas</span>" +
    "<span class='bullitDescription'>Waste</span>" +
    "<span class='txtDescription'>Please contribute to the project! Open an issue ticket to announce a feature request, or pull request. </span>" +
    "<span class='txtDescription'>A few ideas: restructuring for modularization, extra module and canvas for " +
    "a specific, deeper analysis. </span>" +
    "<span class='txtDescription'>Or fix a calculation error. " +
    "<a href='https://github.com/44xtc44/prokif/issues'>GitHub PROKIF</a></span>";
}

function textColumnFive() {
  const divColumnFive = document.getElementById("divColumnFive");
  divColumnFive.innerHTML =
    "<code>Description: (Beta)<br><br></code>" +
    "<code>This kind of diagram, plot is often used in chemical or geological industries." +
    "Distribution of three gases in an equilibrium or three rock types in an geo area.<br><br></code>" +
    "<code>At first the measuring tool, diagram is an equilateral (gleichseitiges) triangle.</code>" +
    "<code>Each angle is 60°.</code>" +
    "<code>Edge point A owns side a, B owns side b, C owns side c.</code>" +
    "<code>Each edge point owns the opposite site. </code>" +
    "<code>Edge is 100%. The opposite site represents always 0%.</code>" +
    "<code>Triangle sides are moved inwards from 0% to display a higher percentage.</code>" +
    "<code>Read and draw direction is (here) anti-clockwise. Please note the arrows.</code>" +
    "<code>Triangle A,B and C edge points represent one point(x,y) on a x and y 2D coordinate system (cartesian).<br><br></code>" +
    "<code>Calculation and drawing.</code>" +
    "<code>Drawing the point of interest (POI) needs some mathmatics.</code>" +
    "<code>The measurement tool, triangle represents always three items in a system.</code>" +
    "<code>The system represents always 100%, regardless of the size of the system.</code>" +
    "<code>An evenly distributed system would be 33.3% A, 33.3% B, 33.3% C. 100%.</code>" +
    "<code>1 box of each A and B and C (3 boxes) represent the same 100% as 100 boxes of each A,B,C (300 boxes).<br><br></code>" +
    "<code>Geometric approach.</code>" +
    "<code>POI is the intersection of two lines moved parallel from the triangle sides inwards.</code>" +
    "<code>The third line intersection results from the preceding two lines as well as a line movement.<br><br></code>" +
    "<code>Mathmatic approach.</code>" +
    "<code>Example {wind:20%, bio:70%, coal:10%}<br><br></code>" +
    "<code>All points on each lines A-B, B-C, C-A are part of a line of 100%.</code>" +
    "<code>The line of A-B (100%) can be cut for wind at 20 percent. This 20 percent is point(x,y) on line A-B, small c.</code>" +
    "<code>We found the starting point of the first line. The endpoint of line one can be found on the next site of the triangle in read direction.<br><br></code>" +
    "<code>Each triangle angle is 60°. Each triangle site point can be seen as 60° rotated.</code>" +
    "<code>We go in read direction (here) anti-clockwise and take a look at the next side. We had 20% of wind on c. Next side is a, or B-C.</code>" +
    "<code>Move wind side C-A, or small b, 0% wind to 20% wind at 60° inwards. One intersection is found on side a, B-C 80%. The other on c, A-B 20%.</code>" +
    "<code>100% minus 20% equals 80% on a.</code>" +
    "<code>This can be repeated for every item in the system to get the start and end points (x1,y1,x2,y2) of each line.</code>" +
    "<code>Now the intersection point of line one with line two, line one with line three, line two with line three can be calculated.</code>" +
    "<code>We need only one valid calculation to get the intersection point, drawing point.</code>" +
    "<code>Intersection of line three auto-results from previous calculations, or must reveal the same result if calculated.<br><br></code>" +
    "<code>Cheers</code>";
}
