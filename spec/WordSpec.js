'use strict';

const Word = require("src/Word.js");

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

  describe("ignores non-word content", function() {
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
  });

  it("defaults to unverified", function() {
    const word = new Word("palabra");
    expect(word.learningStatus).toEqual("unverified");
  });

  it("defaults to no Fieldbook ID", function() {
    const word = new Word("palabra");
    expect(word.fieldbookId).toBeNull();
  });

  it("can have custom learning status", function() {
    const word = new Word("palabra", "aoeu");
    expect(word.learningStatus).toEqual("aoeu");
  });

  it("marks a word as known", function() {
    const element = dom.createElement("p", {}, "palabra");
    const word = new Word(element);

    expect(word.learningStatus).toEqual("unverified");
    expect(word.occurrences[0]).toHaveClass("unverified");
    expect(word.occurrences[0]).not.toHaveClass("unknown");
    expect(word.occurrences[0]).not.toHaveClass("known");

    word.markAsKnown();

    expect(word.learningStatus).toEqual("known");
    expect(word.occurrences[0]).not.toHaveClass("unverified");
    expect(word.occurrences[0]).not.toHaveClass("unknown");
    expect(word.occurrences[0]).toHaveClass("known");
  });

  it("marks a word as unknown", function() {
    const element = dom.createElement("p", {}, "palabra");
    const word = new Word(element, "known");

    expect(word.learningStatus).toEqual("known");
    expect(word.occurrences[0]).not.toHaveClass("unverified");
    expect(word.occurrences[0]).not.toHaveClass("unknown");
    expect(word.occurrences[0]).toHaveClass("known");

    word.markAsUnknown();

    expect(word.learningStatus).toEqual("unknown");
    expect(word.occurrences[0]).not.toHaveClass("unverified");
    expect(word.occurrences[0]).toHaveClass("unknown");
    expect(word.occurrences[0]).not.toHaveClass("known");
  });

  it("starts with no occurrences", function() {
    const word = new Word("palabra");
    expect(word.occurrences).toBeEmpty();
  });

  it("adds CSS classes to the element", function() {
    const element = dom.createElement("p", {}, "palabra");
    const word = new Word(element);

    expect(word.occurrences[0]).toHaveClass("L2");
  });

  it("adds occurrences to the same Word with same text", function() {
    const word1 = Word.create(dom.createElement("p", {}, "palabra"));
    const word2 = Word.create(dom.createElement("div", {}, "palabra"));

    expect(word1).toBe(word2);
    expect(word1.occurrences.length).toBe(2);
  });

  it("adds occurrences to different Words with different text", function() {
    const word1 = Word.create(dom.createElement("p", {}, "palabra"));
    const word2 = Word.create(dom.createElement("p", {}, "frase"));

    expect(word1).not.toBe(word2);
    expect(word1.occurrences.length).toBe(1);
    expect(word2.occurrences.length).toBe(1);
  });

  it("deletes all created Words", function() {
    const word1 = Word.create(dom.createElement("p", {}, "palabra"));
    const word2 = Word.create(dom.createElement("p", {}, "palabra"));
    expect(word1).toBe(word2);
    expect(word1.occurrences.length).toBe(2);

    Word.forgetAll();

    const word3 = Word.create(dom.createElement("p", {}, "palabra"));
    expect(word3).not.toBe(word1);
    expect(word3.occurrences.length).toBe(1);
  });

  it("preserves learning status when creating twice", function() {
    const element = dom.createElement("p", {}, "palabra");
    const word = Word.create(element, "known");
    expect(word.learningStatus).toEqual("known");

    Word.create("palabra");
    expect(word.learningStatus).toEqual("known");
    expect(word.occurrences[0]).toHaveClass("known");
    expect(word.occurrences[0]).not.toHaveClass("unknown");
  });

  it("can change learning status when creating twice", function() {
    const element = dom.createElement("p", {}, "palabra");
    const word = Word.create(element, "unknown");
    expect(word.learningStatus).toEqual("unknown");

    Word.create("palabra", "known");
    expect(word.learningStatus).toEqual("known");
    expect(word.occurrences[0]).toHaveClass("known");
    expect(word.occurrences[0]).not.toHaveClass("unknown");
  });

  it("adds and removes click handlers", function() {
    const element = dom.createElement("p", {}, "palabra");
    const word = new Word(element);
    let callCount = 0;

    const handler = function() {
      callCount += 1;
      expect(callCount).toBe(1);

      word.removeClickHandlers();
      word.clickHandlers.forEach(function(noHandler) {
        expect(noHandler).toBeNull();
      });

      element.click(); // should not increment callCount anymore
    };

    word.addClickHandler(element, handler);
    element.click();
  });

  it("doesn't blow up if a click handler has been deleted", function() {
    const element = dom.createElement("p", {}, "palabra");
    const word = new Word(element);

    /* istanbul ignore next */
    const doNotCallHandler = function() {
      fail("should not have called click handler");
    };

    word.addClickHandler(element, doNotCallHandler);
    word.removeClickHandlers();
    word.removeClickHandlers();

    element.click();
    expect(word.clickHandlers[0]).toBeNull();
  });

  describe("equality", function() {
    it("is equal when all properties match", function() {
      const element = dom.createElement("p", {}, "palabra");
      const word1 = new Word(element, "known");
      const word2 = new Word(element, "known");
      expect(word1).toEqual(word2);
    });

    it("is not equal when other object is not a Word", function() {
      const element = dom.createElement("p", {}, "palabra");
      const word1 = new Word(element, "known");
      const obj = new Object();
      expect(word1).not.toEqual(obj);
    });

    it("is not equal when text does not match", function() {
      const word1 = new Word(dom.createElement("p", {}, "uno"), "known");
      const word2 = new Word(dom.createElement("p", {}, "dos"), "known");
      expect(word1).not.toEqual(word2);
    });

    it("is not equal when learning status does not match", function() {
      const element = dom.createElement("p", {}, "palabra");
      const word1 = new Word(element, "unknown");
      const word2 = new Word(element, "known");
      expect(word1).not.toEqual(word2);
    });

    it("is not equal when Fieldbook IDs do not match", function() {
      const element = dom.createElement("p", {}, "palabra");
      const word1 = new Word(element, "known");
      word1.fieldbookId = 1;
      const word2 = new Word(element, "known");
      word2.fieldbookId = 2;
      expect(word1).not.toEqual(word2);
    });

    it("is not equal when number of occurrences do not match", function() {
      const element = dom.createElement("p", {}, "palabra");
      const word1 = new Word(element, "known");
      const word2 = new Word(element, "known");
      word2.addOccurrence(element);

      expect(word1.occurrences.length).toBe(1);
      expect(word2.occurrences.length).toBe(2);
      expect(word1).not.toEqual(word2);
    });
  });
});
