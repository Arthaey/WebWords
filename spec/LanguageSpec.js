'use strict';

const Language = require("src/Language.js");

describe("Language", function() {
  it("constructor does nothing", function() {
    const language = new Language();
    expect(language).not.toBeUndefined();
    expect(language).not.toBeNull();
  });

  it("returns null when no text is given", function() {
    expect(Language.identify(null)).toEqual(Language.UNKNOWN);
  });

  it("returns null when it cannot identify text", function() {
    expect(Language.identify("a")).toEqual(Language.UNKNOWN);
  });

  it("identifies Spanish", function() {
    expect(Language.identify("Ñ")).toEqual(Language.SPANISH);
  });

  it("identifies French", function() {
    expect(Language.identify("C'EST")).toEqual(Language.FRENCH);
    expect(Language.identify("X ET Y")).toEqual(Language.FRENCH);
    expect(Language.identify("IL EST")).toEqual(Language.FRENCH);
  });
});
