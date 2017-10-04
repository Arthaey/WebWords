'use strict';

const InfoBox = require("./InfoBox.js");
const Language = require("./Language.js");
const Page = require("./Page.js");
const Word = require("./Word.js");

const WebWords = function() {
};

WebWords.STYLESHEET_ID = "webwords-stylesheet";

WebWords.init = function(rootElement) {
  if (!rootElement) return null;

  WebWords.addCssRules(Word.cssRules);
  WebWords.addCssRules(InfoBox.cssRules);

  const langCode = Language.identify(rootElement.innerText);
  return new Page(langCode, rootElement);
};

WebWords.destroy = function() {
  const style = WebWords._getStyleElement();
  if (style) style.parentNode.removeChild(style);
};

WebWords.addCssRules = function(rules) {
  rules.forEach(function(rule) {
    const stylesheet = WebWords._getOrCreateStylesheet();
    stylesheet.insertRule(rule, stylesheet.cssRules.length);
  });
};

WebWords._getStyleElement = function() {
  return document.getElementById(WebWords.STYLESHEET_ID);
};

WebWords._getOrCreateStylesheet = function() {
  const existingStyleElem = WebWords._getStyleElement();
  if (existingStyleElem) {
    return existingStyleElem.sheet;
  }

  const styleElem = document.createElement("style");
  styleElem.id = WebWords.STYLESHEET_ID;
  document.head.appendChild(styleElem);

  return styleElem.sheet;
};

module.exports = WebWords;

// expose just WebWords to the global namespace, so the browser can call init.
global.WebWords = WebWords;
