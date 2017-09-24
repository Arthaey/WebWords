'use strict';

describe("WebWords", function() {
  it("adds exactly one stylesheet", function() {
    const startingCount = document.head.querySelectorAll("style").length;
    WebWords.addCssRules([".foo { color: red }", ".bar { color: blue }"]);
    const endingCount = document.head.querySelectorAll("style").length;
    expect(endingCount).toBe(startingCount + 1);
  });

});
