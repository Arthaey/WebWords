'use strict';

describe("WebWords", function() {
  let startingStylesheetCount;

  beforeEach(function() {
    startingStylesheetCount = countStylesheets();
  });

  it("does not runs when there are no elements", function() {
    const page = WebWords.init(null);

    expect(page).toBeNull();
    expect(countStylesheets()).toEqual(startingStylesheetCount);
  });


  it("does not runs on the page when it cannot identify the language", function() {
    const element = dom.createElement("p", {}, "?");
    const page = WebWords.init(element);

    expect(page.langCode).toEqual(Language.UNKNOWN);
    expect(page.totalWordCount).toEqual(0);
  });

  it("runs on the page when it identifies the language", function() {
    const element = dom.createElement("p", {}, "palabras con ñ");
    const page = WebWords.init(element);

    expect(page.langCode).toEqual(Language.SPANISH);
    expect(page.totalWordCount).toEqual(3);
  });

  it("adds exactly one stylesheet", function() {
    WebWords.addCssRules([".foo { color: red }", ".bar { color: blue }"]);
    expect(countStylesheets()).toBe(startingStylesheetCount + 1);
  });

  const countStylesheets = function() {
    return document.head.querySelectorAll("style").length;
  };
});
