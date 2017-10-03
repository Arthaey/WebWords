'use strict';

describe("WebWords", function() {
  let startingStylesheetCount;
  let page;

  beforeEach(function() {
    startingStylesheetCount = countStylesheets();
  });

  afterEach(function() {
    if (page) page.destroy();
  });

  it("constructor does nothing", function() {
    const webWords = new WebWords();
    expect(webWords).not.toBeUndefined();
    expect(webWords).not.toBeNull();
  });

  it("does not runs when there are no elements", function() {
    page = WebWords.init(null);

    expect(page).toBeNull();
    expect(countStylesheets()).toEqual(startingStylesheetCount);
  });

  it("does not runs on the page when it cannot identify the language", function() {
    const element = dom.createElement("p", {}, "?");
    page = WebWords.init(element);

    expect(page.langCode).toBe(Language.UNKNOWN);
    expect(page.words).toBeEmpty();
    expect(page.pageElements).toBeEmpty();
  });

  it("runs on the page when it identifies the language", function() {
    const element = dom.createElement("p", {}, "palabras con ñ");
    page = WebWords.init(element);

    expect(page.langCode).toEqual(Language.SPANISH);
    expect(page.stats.totalWordCount).toEqual(3);
  });

  it("adds exactly one stylesheet", function() {
    WebWords.addCssRules([".foo { color: red }", ".bar { color: blue }"]);
    expect(countStylesheets()).toBe(startingStylesheetCount + 1);
  });

  it("add CSS rules for all components", function() {
    spyOn(WebWords, 'addCssRules');

    const element = dom.createElement("p", {}, "palabras con ñ");
    page = WebWords.init(element);

    expect(WebWords.addCssRules).toHaveBeenCalledWith(Word.cssRules);
    expect(WebWords.addCssRules).toHaveBeenCalledWith(InfoBox.cssRules);
  });

  it("adds an InfoBox on page load", function() {
    const element = dom.createElement("p", {}, "palabras con ñ");
    page = WebWords.init(element);

    expect(page.words).not.toEqual({});
    expect(page.infoBox.element).toHaveText("ES: mark up words");
    expect(jasmine.Ajax.requests.count()).toBe(0);

    page.infoBox.destroy();
  });

  const countStylesheets = function() {
    return document.head.querySelectorAll("style").length;
  };
});
