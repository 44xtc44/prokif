// dataTime.js
"use strict";

/**
 * Convert unix time in JS time.
 * @param {number} unixTimestamp unix time format
 * @returns {Object} date components in human readable format
 */
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

/**
 * JS time from yesterday.
 * @returns {Object} date components 
 */
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