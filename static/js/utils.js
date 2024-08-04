// utils.js
"use strict";
/**
 * Stack div and use it as a list.
 * @param {{*}} opt dictionary
 * @example appendDiv({ parentId: 'div0ne', childId: 'c1', innerText: 'low', elemClass: 'logger' });
 */
function appendDiv(opt) {
  let div = document.createElement("div");
  div.id = opt.childId;
  div.classList.add(opt.elemClass);
  div.innerText = opt.innerText;
  if (opt.innerHTML !== undefined) div.innerHTML = opt.innerHTML;
  opt.parentId.appendChild(div); // parent is full path document.getElem...
}