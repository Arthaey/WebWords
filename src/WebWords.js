'use strict';

const WebWords = {
  punctRegex:    /[.,:;'"?!¿¡]+/g,
  splitRegex: /([\s.,:;'"?!¿¡]+)/,

  fieldbookUrl: "https://api.fieldbook.com/v1/59c3d8c68c1f2a030083673e/",
  fieldbookKeyId: "WebWords-FieldbookKey",
  fieldbookSecretId: "WebWords-FieldbookSecret",

  stylesheetId: "webwords-stylesheet",

  init: function(rootElement) {
    if (!rootElement) return null;

    const langCode = Language.identify(rootElement.innerText);
    if (!langCode) return new Page();

    WebWords.addCssRules(InfoBox.cssRules);
    return new Page(langCode, rootElement);
  },

  addCssRules: function(rules) {
    rules.forEach(function(rule) {
      const stylesheet = WebWords._getOrCreateStylesheet();
      stylesheet.insertRule(rule, stylesheet.cssRules.length);
    });
  },

  _getOrCreateStylesheet: function() {
    const existingStyleElem = document.getElementById(WebWords.stylesheetId);
    if (existingStyleElem) {
      return existingStyleElem.sheet;
    }

    const styleElem = document.createElement("style");
    styleElem.id = WebWords.stylesheetId;
    document.head.appendChild(styleElem);

    return styleElem.sheet;
  },
};
