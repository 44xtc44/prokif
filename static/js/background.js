// background.js
"use strict";
/**
 * Can load either "background" or "content_scripts" by pressing button
 */
function openTab(){
    var newTab = browser.tabs.create({ 
      url: "/static/index.html",
      active:true
    }).then(() => {
      browser.tabs.executeScript({
        code: `console.log('Add-on creator:', '44xtc44');`,
      });
    });
}
browser.browserAction.onClicked.addListener(openTab)
