'use strict';

describe("WebWords", function() {
  it("runs on the page", function() {
    const element = dom.createElement("p", {}, "palabra");
    const page = WebWords.init("es", element);
    expect(page.totalWordCount).toEqual(1);
  });

  it("adds exactly one stylesheet", function() {
    const startingCount = document.head.querySelectorAll("style").length;
    WebWords.addCssRules([".foo { color: red }", ".bar { color: blue }"]);
    const endingCount = document.head.querySelectorAll("style").length;
    expect(endingCount).toBe(startingCount + 1);
  });
});
