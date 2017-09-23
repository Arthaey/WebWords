'use strict';

describe("Word", function() {
  let element;

  beforeEach(function() {
    element = dom.createElement("p", {}, "palabra");
  });

  afterEach(function() {
    dom.cleanup();
  });

  it("has text", function() {
    const word = new Word(element);
    expect(word.text).toEqual("palabra");
  });

  it("strips whitespace", function() {
    const word = new Word(dom.createElement("p", {}, "  palabra  "));
    expect(word.text).toEqual("palabra");
  });

  it("is case-insensitive", function() {
    const word = new Word(dom.createElement("p", {}, "Palabra"));
    expect(word.text).toEqual("palabra");
  });

  it("ignores punctuation", function() {
    const word = new Word(dom.createElement("p", {}, "'Palabra.'"));
    expect(word.text).toEqual("palabra");
  });

  it("defaults to unknown", function() {
    const word = new Word(element);
    expect(word.learningStatus).toEqual("unknown");
  });

  it("can have custom learning status", function() {
    const word = new Word(element, "known");
    expect(word.learningStatus).toEqual("known");
  });

  it("marks as known when clicked", function() {
    const word = new Word(element);
    expect(word.learningStatus).toEqual("unknown");

    element.click();

    expect(word.learningStatus).toEqual("known");
  });

  it("is equal to another Word, ignoring the element", function() {
    const word1 = new Word(dom.createElement("p", {}, "palabra"));
    const word2 = new Word(dom.createElement("div", {}, "palabra"));
    expect(word1).toEqual(word2);
  });
});
