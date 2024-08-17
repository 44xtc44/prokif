// background.js
"use strict";
/**
 * Loader of the Browser Add-on.
 * https://stackoverflow.com/questions/69296754/chrome-extension-action-onclicked
 * Called when the user clicks on the browser action.
 */
chrome.action.onClicked.addListener(tab => {
  // Send a message to the active tab
  chrome.tabs.create({ url: "/static/addon.html" }).then(() => {
    chrome.tabs.executeScript({
      code: `console.log('Add-on creator:', '44xtc44');`,
    });
  });
});