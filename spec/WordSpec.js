'use strict';

describe("Word", function() {
  afterEach(function() {
    dom.cleanup();
  });

  it("requires text", function() {
    expect(function() { new Word() }).toThrow();
  });

  it("has text from a string", function() {
    const word = new Word("palabra");
    expect(word.text).toEqual("palabra");
  });

  it("has text from within an element", function() {
    const word = new Word(dom.createElement("p", {}, "palabra"));
    expect(word.text).toEqual("palabra");
  });

  it("strips whitespace", function() {
    const word = new Word( "  palabra  ");
    expect(word.text).toEqual("palabra");
  });

  it("is case-insensitive", function() {
    const word = new Word( "Palabra");
    expect(word.text).toEqual("palabra");
  });

  it("ignores punctuation", function() {
    const word = new Word( "'Palabra.'");
    expect(word.text).toEqual("palabra");
  });

  it("defaults to unknown", function() {
    const word = new Word("palabra");
    expect(word.learningStatus).toEqual("unknown");
  });

  it("can have custom learning status", function() {
    const word = new Word("palabra", "known");
    expect(word.learningStatus).toEqual("known");
  });

  it("marks as known when clicked", function() {
    const element = dom.createElement("p", {}, "palabra");
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
