'use strict';

const Fieldbook = require("../src/Fieldbook.js");
const Language = require("../src/Language.js");
const Page = require("../src/Page.js");
const Statistics = require("../src/Statistics.js");
const Word = require("../src/Word.js");

describe("Page", function() {
  let page;

  afterEach(function() {
    if (page) page.destroy();
  });

  it("starts with no words", function() {
    page = new Page();
    expect(page.langCode).toEqual(Language.UNKNOWN);
    expect(page.stats).toEqual(new Statistics());
    expect(page.words).toBeEmpty();
    expect(page.infoBox).not.toBeUndefined();
    expect(page.infoBox).not.toBeNull();
  });

  it("creates a Word for each supported element", function() {
    const elements = dom.createElement("div", {},
      dom.createElement("h1", {}, "uno"),
      dom.createElement("h2", {}, "dos"),
      dom.createElement("h3", {}, "tres"),
      dom.createElement("h4", {}, "cuatro"),
      dom.createElement("h5", {}, "cinco"),
      dom.createElement("h6", {}, "seis"),
      dom.createElement("p", {}, "siete"),
      dom.createElement("article", {}, "ocho")
    );

    page = new Page(Language.SPANISH, elements);

    expect(page.langCode).toEqual(Language.SPANISH);
    expect(page.stats).toEqual(new Statistics({
      totalWordCount: 8,
      uniqueWordCount: 8,
      totalKnownWordCount: 0,
      uniqueKnownWordCount: 0,
    }));
    expect(page.words["uno"].occurrences.length).toBe(1);
    expect(page.words["dos"].occurrences.length).toBe(1);
    expect(page.words["tres"].occurrences.length).toBe(1);
    expect(page.words["cuatro"].occurrences.length).toBe(1);
    expect(page.words["cinco"].occurrences.length).toBe(1);
    expect(page.words["seis"].occurrences.length).toBe(1);
    expect(page.words["siete"].occurrences.length).toBe(1);
    expect(page.words["ocho"].occurrences.length).toBe(1);
    expect(page.infoBox).not.toBeNull();

    expect(page.words["uno"].occurrences[0].classList).not.toContain("unknown");
  });

  it("counts unique words", function() {
    const elements = dom.createElement("div", {},
      dom.createElement("p", {}, "uno"),
      dom.createElement("p", {}, "dos"),
      dom.createElement("p", {}, "tres dos uno")
    );

    page = new Page(Language.SPANISH, elements);

    expect(page.stats).toEqual(new Statistics({
      totalWordCount: 5,
      uniqueWordCount: 3,
      totalKnownWordCount: 0,
      uniqueKnownWordCount: 0,
    }));
    expect(page.words["uno"].occurrences.length).toBe(2);
    expect(page.words["dos"].occurrences.length).toBe(2);
    expect(page.words["tres"].occurrences.length).toBe(1);
    expect(page.words["cuatro"]).toBeUndefined();
  });

  it("wraps each word in an element", function() {
    const text = "uno dos tres";
    const element = dom.createElement("p", {}, text);
    const expectedHTML =
      '<span class="L2 unverified">uno</span> ' +
      '<span class="L2 unverified">dos</span> ' +
      '<span class="L2 unverified">tres</span>';

    page = new Page(Language.SPANISH, element);

    expect(page.rootElement.innerText).toEqual(text);
    expect(page.rootElement.innerHTML).toEqual(expectedHTML);
    expect(page.rootElement.querySelectorAll(".L2").length).toBe(3);
  });

  it("counts known vs unknown words, and unique words", function() {
    Word.create("dos", "known");
    const element = dom.createElement("p", {}, "uno dos tres cuatro tres dos");

    page = new Page(Language.SPANISH, element);

    expect(page.stats).toEqual(new Statistics({
      totalWordCount: 6,
      uniqueWordCount: 4,
      totalKnownWordCount: 2,
      uniqueKnownWordCount: 1,
    }));
  });

  it("destroys itself", function() {
    page = new Page();
    expect(page.infoBox).not.toBeUndefined();
    expect(page.infoBox).not.toBeNull();

    page.destroy();
    expect(page.infoBox).toBeNull();
  });

  describe("ignores non-word content", function() {
    it("preserves displayed case and punctuation", function() {
      const text = "'¿Uno, dos?'";
      const element = dom.createElement("p", {}, text);

      page = new Page(Language.SPANISH, element);

      expect(page.rootElement.innerText).toEqual(text);
      expect(page.rootElement.querySelectorAll(".L2").length).toBe(2);
    });

    it("preserves links and other HTML tags", function() {
      const element = dom.createElement("p", {},
        document.createTextNode("uno "),
        dom.createElement("em", {}, "dos"),
        document.createTextNode(" "),
        dom.createElement("a", {href: "example.com"}, "tres"),
        document.createTextNode(" cuatro cinco. Seis!")
      );

      page = new Page(Language.SPANISH, element);

      expect(page.rootElement.querySelectorAll(".L2").length).toBe(6);

      expect(page.rootElement.innerText).toEqual("uno dos tres cuatro cinco. Seis!");

      const pageElements = page.rootElement.childNodes;
      expect(page.words["uno"].occurrences[0].innerText).toEqual("uno");
      expect(page.words["dos"].occurrences[0].innerText).toEqual("dos");
      expect(page.words["tres"].occurrences[0].innerText).toEqual("tres");
      expect(page.words["cuatro"].occurrences[0].innerText).toEqual("cuatro");
      expect(page.words["cinco"].occurrences[0].innerText).toEqual("cinco");
      expect(page.words["seis"].occurrences[0].innerText).toEqual("Seis");

      expect(page.words["uno"].occurrences[0].parentNode.tagName).toEqual("P");
      expect(page.words["dos"].occurrences[0].parentNode.tagName).toEqual("EM");
      expect(page.words["tres"].occurrences[0].parentNode.tagName).toEqual("A");
      expect(page.words["cuatro"].occurrences[0].parentNode.tagName).toEqual("P");
      expect(page.words["cinco"].occurrences[0].parentNode.tagName).toEqual("P");
      expect(page.words["seis"].occurrences[0].parentNode.tagName).toEqual("P");
    });

    it("does not include parentheses in the word", function() {
      const text = "(palabra)";
      const element = dom.createElement("p", {}, text);

      page = new Page(Language.SPANISH, element);

      expect(page.rootElement.innerText).toEqual(text);
      expect(page.rootElement.querySelectorAll(".L2").length).toBe(1);
      expect(page.words["palabra"]).not.toBeUndefined();
    });

    it("does not include square brackets in the word", function() {
      const text = "[palabra]";
      const element = dom.createElement("p", {}, text);

      page = new Page(Language.SPANISH, element);

      expect(page.rootElement.innerText).toEqual(text);
      expect(page.rootElement.querySelectorAll(".L2").length).toBe(1);
      expect(page.words["palabra"]).not.toBeUndefined();
    });

    it("does not include angle brackets in the word", function() {
      const text = "<palabra>";
      const element = dom.createElement("p", {}, text);

      page = new Page(Language.SPANISH, element);

      expect(page.rootElement.innerText).toEqual(text);
      expect(page.rootElement.querySelectorAll(".L2").length).toBe(1);
      expect(page.words["palabra"]).not.toBeUndefined();
    });

    it("does not include angle quotes in the word", function() {
      const text = "«palabra»";
      const element = dom.createElement("p", {}, text);

      page = new Page(Language.SPANISH, element);

      expect(page.rootElement.innerText).toEqual(text);
      expect(page.rootElement.querySelectorAll(".L2").length).toBe(1);
      expect(page.words["palabra"]).not.toBeUndefined();
    });

    it("does not include curly quotes in the word", function() {
      const text = "“palabra”";
      const element = dom.createElement("p", {}, text);

      page = new Page(Language.SPANISH, element);

      expect(page.rootElement.innerText).toEqual(text);
      expect(page.rootElement.querySelectorAll(".L2").length).toBe(1);
      expect(page.words["palabra"]).not.toBeUndefined();
    });

    it("separates words by slashes", function() {
      const text = "uno/dos";
      const element = dom.createElement("p", {}, text);

      page = new Page(Language.SPANISH, element);

      expect(page.rootElement.innerText).toEqual(text);
      expect(page.rootElement.querySelectorAll(".L2").length).toBe(2);
      expect(page.words["uno"]).not.toBeUndefined();
      expect(page.words["dos"]).not.toBeUndefined();
    });

    it("ignores numeric 'words'", function() {
      const text = "uno 2 tres 42";
      const element = dom.createElement("p", {}, text);

      page = new Page(Language.SPANISH, element);

      expect(page.rootElement.innerText).toEqual(text);
      expect(page.rootElement.querySelectorAll(".L2").length).toBe(2);
      expect(page.stats.totalWordCount).toBe(2);
      expect(page.words["uno"].text).toBe("uno");
      expect(page.words["tres"].text).toBe("tres");
    });
  });

  describe("with saved data", function() {
    let elements;

    beforeEach(function() {
      elements = dom.createElement("div", {},
        dom.createElement("p", {}, "Esta es una frase."),
        dom.createElement("p", {}, "Y esta es otra.")
      );
    });

    it("loads learning statuses", function(asyncDone) {
      const json = `[
        {
          "id": 1,
          "record_url": "http://example.com/records/abc",
          "word": "es",
          "how_well_known": "known"
        },
        {
          "id": 2,
          "record_url": "http://example.com/records/xyz",
          "word": "y",
          "how_well_known": "unknown"
        }
      ]`;

      page = new Page(Language.SPANISH, elements);

      expect(page.stats).toEqual(new Statistics({
        totalWordCount: 8,
        uniqueWordCount: 6,
        totalKnownWordCount: 0,
        uniqueKnownWordCount: 0,
      }));

      expect(page.words["es"].occurrences[0].classList).toContain("unverified");
      expect(page.words["es"].occurrences[1].classList).toContain("unverified");
      expect(page.words["y"].occurrences[0].classList).toContain("unverified");
      expect(page.words["otra"].occurrences[0].classList).toContain("unverified");

      page.getSavedWords().then(function() {
        expect(page.stats).toEqual(new Statistics({
          totalWordCount: 8,
          uniqueWordCount: 6,
          totalKnownWordCount: 2,
          uniqueKnownWordCount: 1,
        }));

        expect(page.words["es"].occurrences[0].classList).toContain("known");
        expect(page.words["es"].occurrences[1].classList).toContain("known");
        expect(page.words["y"].occurrences[0].classList).toContain("unknown");
        expect(page.words["otra"].occurrences[0].classList).toContain("unknown");
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), json);
    });

    it("ignores Fieldbook words that aren't on this page", function(asyncDone) {
      const json = `[
        {
          "id": 1,
          "record_url": "http://example.com/records/abc",
          "word": "nada",
          "how_well_known": "known"
        }
      ]`;

      page = new Page(Language.SPANISH, elements);

      expect(page.stats.totalKnownWordCount).toBe(0);
      expect(page.stats.uniqueKnownWordCount).toBe(0);
      expect(page.words["nada"]).toBeUndefined();

      page.getSavedWords().then(function() {
        expect(page.stats.totalKnownWordCount).toBe(0);
        expect(page.stats.uniqueKnownWordCount).toBe(0);
        expect(page.words["nada"]).toBeUndefined();
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), json);
    });

    it("marks a word as known when text is clicked", function() {
      page = new Page(Language.SPANISH, elements);
      expect(page.infoBox).not.toBeUndefined();
      expect(page.infoBox).not.toBeNull();

      spyOn(Fieldbook, "createRecord");
      spyOn(page.infoBox, "update");

      page.words["y"].occurrences[0].click();

      expect(Fieldbook.createRecord).toHaveBeenCalled();
      expect(page.infoBox.update).toHaveBeenCalled();
    });

    it("does nothing when a known word is clicked", function(asyncDone) {
      page = new Page(Language.SPANISH, elements);

      const word = page.words["y"];
      const records = fakeFieldbookRecords(["y"]);

      page.getSavedWords().then(function() {
        expect(word.learningStatus).toBe(Word.KNOWN);
        spyOn(Fieldbook, "createRecord");
        spyOn(page.infoBox, "update");

        word.occurrences[0].click();

        expect(Fieldbook.createRecord).not.toHaveBeenCalled();
        expect(page.infoBox.update).not.toHaveBeenCalled();
        expect(word.learningStatus).toBe(Word.KNOWN);
        asyncDone();
      })

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), records);
    });

    it("updates Fieldbook when marking a word as known", function(asyncDone) {
      page = new Page(Language.SPANISH, elements);

      const word = page.words["y"];
      const records = fakeFieldbookRecords(["y"]);

      page.getSavedWords().then(function() {
        expect(word.occurrences[0].classList).toContain("unknown");
        expect(word.fieldbookId).toBeNull();
        expect(page.infoBox.element).toHaveText("0% words known");
        expect(page.infoBox.element).toHaveText("0% page known");
      })
      .then(function() {
        const promise = page.markAsKnown(word);
        mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), records);
        return promise;
      })
      .then(function() {
        expect(word.occurrences[0].classList).toContain("known");
        expect(word.fieldbookId).not.toBeNull();
        expect(page.infoBox.element).toHaveText("17% words known");
        expect(page.infoBox.element).toHaveText("13% page known");
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), "[]");
    });

    it("does NOT update Fieldbook if word is already known ", function(asyncDone) {
      page = new Page(Language.SPANISH, elements);
      const word = page.words["y"];

      page.getSavedWords().then(function() {
        expect(word.occurrences[0].classList).toContain("known");
        expect(word.fieldbookId).not.toBeNull();
        return page.markAsKnown(word);
      })
      .then(function() {
        expect(jasmine.Ajax.requests.count()).toBe(1);
        asyncDone();
      });

      const records = fakeFieldbookRecords(["y"]);
      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), records);
    });

    it("does not blow up on bad Fieldbook records", function(asyncDone) {
      page = new Page(Language.SPANISH, elements);
      spyOn(console, "error");

      page.getSavedWords().then(function() {
        expect(console.error).toHaveBeenCalled();
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), "not valid json");
    });
  });
});
