// dataTime.js
"use strict";

function getDateParts(unixTimestamp) {
  return {
    monthDayDigit: new Date(unixTimestamp * 1000).getDate(), // day as a number (1-31)
    monthDigit: new Date(unixTimestamp * 1000).getMonth(), // month (0-11)
    weekDayDigit: new Date(unixTimestamp * 1000).getDay(), // weekday as a number (0-6)
    yearDigits: new Date(unixTimestamp * 1000).getFullYear(), // four digit year (yyyy)
    hour: new Date(unixTimestamp * 1000).getHours(), // hour (0-23)
    milli: new Date(unixTimestamp * 1000).getMilliseconds(), // milliseconds (0-999)
    minute: new Date(unixTimestamp * 1000).getMinutes(), // minutes (0-59)
    seconds: new Date(unixTimestamp * 1000).getSeconds(), // seconds (0-59)
    ticks: new Date(unixTimestamp * 1000).getTime(), // time (milliseconds since January 1, 1970)
    dayName: new Date(unixTimestamp * 1000).toLocaleString('en-us', {weekday:'short'}),
    monthName: new Date(unixTimestamp * 1000).toLocaleString('en-us', {month:'short'}),
  };
}

function getYesterday() {
  const yObj = {};
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  yObj["day"] = yesterday.getDate();
  yObj["month"] = yesterday.getMonth();
  yObj["year"] = yesterday.getFullYear();

  if (yObj["day"].toString().length === 1) yObj["day"] = "0" + yObj["day"];
  if (yObj["month"].toString().length === 1)
    yObj["month"] = "0" + yObj["month"];

  return yObj;
}
/* ---------------------------------- !!!REFAC for test setup!!! ------------------------------------------------- */
function printTestDateConversion() {
  intersect({
    x1: -4,
    y1: 173.20508075688772,
    x2: 98,
    y2: -3.464101615137764,
    x3: 160,
    y3: 173.20508075688772,
    x4: -20,
    y4: -138.5640646055102,
  });

  lineIntersection(
    { x: -4, y: 173.20508075688772 },
    { x: 98, y: -3.464101615137764 },
    { x: 160, y: 173.20508075688772 },
    { x: -20, y: -138.5640646055102 }
  );

  const convDay = tsConvert({
    format: "DAILY",
    first: "2024-01-01T17:00Z", // "2024-01-01T17:00Z"
    last: "2024-02-01T17:00Z", // "2024-22-01T17:00Z"
  });
  console.log("convDay->", convDay);
  const convUX = tsConvert({
    format: "UNIX",
    first: "1704110400", // 1704110400 /1704106800/   1704063600
  });
  console.log("convUX->", convUX);
  const dateArrayFr = [
    1704063600, 1704067200, 1704070800, 1704074400, 1704078000, 1704081600,
    1704085200, 1704088800, 1704092400, 1704096000, 1704099600, 1704103200,
    1704106800, 1704110400, 1704114000, 1704117600, 1704121200, 1704124800,
    1704128400, 1704132000, 1704135600, 1704139200, 1704142800, 1704146400,
  ];
  const frDates = dateArrayFr.map((date) => {
    const convUX = tsConvert({
      format: "UNIX",
      first: date,
    });
    // console.log(convUX)
  });
}
