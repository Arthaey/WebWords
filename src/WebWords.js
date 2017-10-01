'use strict';

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

WebWords.addCssRules = function(rules) {
  rules.forEach(function(rule) {
    const stylesheet = WebWords._getOrCreateStylesheet();
    stylesheet.insertRule(rule, stylesheet.cssRules.length);
  });
};

WebWords._getOrCreateStylesheet = function() {
  const existingStyleElem = document.getElementById(WebWords.STYLESHEET_ID);
  if (existingStyleElem) {
    return existingStyleElem.sheet;
  }

  const styleElem = document.createElement("style");
  styleElem.id = WebWords.STYLESHEET_ID;
  document.head.appendChild(styleElem);

  return styleElem.sheet;
};
