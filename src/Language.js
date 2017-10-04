'use strict';

const Language = function() {
};

Language.UNKNOWN = "??";
Language.FRENCH  = "fr";
Language.SPANISH = "es";

Language.identify = function(text) {
  if (!text) return Language.UNKNOWN;

  if (text.match(/ñ/i)) {
    return Language.SPANISH;
  }

  if (text.match(/\b(est|et)\b/i)) {
    return Language.FRENCH;
  }

  return Language.UNKNOWN;
};

module.exports = Language;
