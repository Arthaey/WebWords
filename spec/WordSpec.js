'use strict';

describe("Word", function() {
  it("requires text", function() {
    expect(function() { new Word() }).toThrow(); /* eslint no-new: "off" */
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

  it("defaults to no Fieldbook ID", function() {
    const word = new Word("palabra");
    expect(word.fieldbookId).toBeNull();
  });

  it("can have custom learning status", function() {
    const word = new Word("palabra", "known");
    expect(word.learningStatus).toEqual("known");
  });

  it("starts with no occurrences", function() {
    const word = new Word("palabra");
    expect(word.occurrences).toBeEmpty();
  });

  it("marks as known when clicked", function() {
    const element = dom.createElement("p", {}, "palabra");
    const word = new Word(element);

    expect(word.learningStatus).toEqual("unknown");
    expect(word.occurrences[0].classList).toContain("unknown");
    expect(word.occurrences[0].classList).not.toContain("known");

    element.click();
    expect(word.learningStatus).toEqual("known");
    expect(word.occurrences[0].classList).not.toContain("unknown");
    expect(word.occurrences[0].classList).toContain("known");
  });

  it("ignores when right-clicked", function() {
    pending("TODO");
  });

  it("adds CSS classes to the element", function() {
    const element = dom.createElement("p", {}, "palabra");
    const word = new Word(element);

    expect(word.occurrences[0].classList).toContain("L2");
  });

  it("adds occurrences to the same Word with same text", function() {
    const word1 = Word.create(dom.createElement("p", {}, "palabra"));
    const word2 = Word.create(dom.createElement("div", {}, "palabra"));

    expect(word1).toEqual(word2);
    expect(word1.occurrences.length).toBe(2);
  });

  it("adds occurrences to different Words with different text", function() {
    const word1 = Word.create(dom.createElement("p", {}, "palabra"));
    const word2 = Word.create(dom.createElement("p", {}, "frase"));

    expect(word1).not.toBe(word2);
    expect(word1.occurrences.length).toBe(1);
    expect(word2.occurrences.length).toBe(1);
  });

  it("preserves learning status when creating twice", function() {
    const element = dom.createElement("p", {}, "palabra");
    const word = Word.create(element, "known");
    expect(word.learningStatus).toEqual("known");

    Word.create("palabra");
    expect(word.learningStatus).toEqual("known");
    expect(word.occurrences[0].classList).toContain("known");
    expect(word.occurrences[0].classList).not.toContain("unknown");
  });

  it("can change learning status when creating twice", function() {
    const element = dom.createElement("p", {}, "palabra");
    const word = Word.create(element, "unknown");
    expect(word.learningStatus).toEqual("unknown");

    Word.create("palabra", "known");
    expect(word.learningStatus).toEqual("known");
    expect(word.occurrences[0].classList).toContain("known");
    expect(word.occurrences[0].classList).not.toContain("unknown");
  });
});
