'use strict';

describe("Page", function() {
  it("starts with no words", function() {
    const page = new Page();
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

    const page = new Page(Language.SPANISH, elements);

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

    const page = new Page(Language.SPANISH, elements);

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

    const page = new Page(Language.SPANISH, element);

    expect(page.pageElements.length).toBe(1);
    expect(page.pageElements[0].innerText).toEqual(text);
    expect(page.pageElements[0].innerHTML).toEqual(expectedHTML);
  });

  it("preserves displayed case and punctuation", function() {
    const text = "'¿Uno, dos?'";
    const element = dom.createElement("p", {}, text);

    const page = new Page(Language.SPANISH, element);

    expect(page.pageElements.length).toBe(1);
    expect(page.pageElements[0].innerText).toEqual(text);
  });

  it("does not include parentheses in the word", function() {
    const text = "(palabra)";
    const element = dom.createElement("p", {}, text);

    const page = new Page(Language.SPANISH, element);

    expect(page.pageElements.length).toBe(1);
    expect(page.pageElements[0].innerText).toEqual(text);
    expect(page.words["palabra"]).not.toBeUndefined();
  });

  it("does not include square brackets in the word", function() {
    const text = "[palabra]";
    const element = dom.createElement("p", {}, text);

    const page = new Page(Language.SPANISH, element);

    expect(page.pageElements.length).toBe(1);
    expect(page.pageElements[0].innerText).toEqual(text);
    expect(page.words["palabra"]).not.toBeUndefined();
  });

  it("separates words by slashes", function() {
    const text = "uno/dos";
    const element = dom.createElement("p", {}, text);

    const page = new Page(Language.SPANISH, element);

    expect(page.pageElements.length).toBe(1);
    expect(page.pageElements[0].innerText).toEqual(text);
    expect(page.words["uno"]).not.toBeUndefined();
    expect(page.words["dos"]).not.toBeUndefined();
  });

  it("ignores numeric 'words'", function() {
    const text = "uno 2 tres 42";
    const element = dom.createElement("p", {}, text);

    const page = new Page(Language.SPANISH, element);

    expect(page.pageElements.length).toBe(1);
    expect(page.pageElements[0].innerText).toEqual(text);
    expect(page.stats.totalWordCount).toBe(2);
    expect(page.words["uno"].text).toBe("uno");
    expect(page.words["tres"].text).toBe("tres");
  });

  it("preserves links", function() {
    pending("FUTURE FEATURE");
  });

  it("counts known vs unknown words, and unique words", function() {
    Word.create("dos", "known");
    const element = dom.createElement("p", {}, "uno dos tres cuatro tres dos");

    const page = new Page(Language.SPANISH, element);

    expect(page.stats).toEqual(new Statistics({
      totalWordCount: 6,
      uniqueWordCount: 4,
      totalKnownWordCount: 2,
      uniqueKnownWordCount: 1,
    }));
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

      const page = new Page(Language.SPANISH, elements);

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

      const page = new Page(Language.SPANISH, elements);

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
      const page = new Page(Language.SPANISH, elements);
      expect(page.infoBox).not.toBeUndefined();
      expect(page.infoBox).not.toBeNull();

      spyOn(Fieldbook, "createRecord");
      spyOn(page.infoBox, "update");

      page.words["y"].occurrences[0].click();

      expect(Fieldbook.createRecord).toHaveBeenCalled();
      expect(page.infoBox.update).toHaveBeenCalled();
    });

    it("updates Fieldbook when marking a word as known", function(asyncDone) {
      const page = new Page(Language.SPANISH, elements);
      const word = page.words["y"];

      page.getSavedWords().then(function() {
        expect(word.occurrences[0].classList).toContain("unknown");
        expect(word.fieldbookId).toBeNull();
      })
      .then(function() {
        const records = fakeFieldbookRecords(["y"]);
        const promise = page.markAsKnown(word);
        mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), records);
        return promise;
      })
      .then(function() {
        expect(word.occurrences[0].classList).toContain("known");
        expect(word.fieldbookId).not.toBeNull();
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), "[]");
    });

    it("does NOT update Fieldbook if word is already known ", function(asyncDone) {
      const page = new Page(Language.SPANISH, elements);
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
      const page = new Page(Language.SPANISH, elements);
      spyOn(console, "error");

      page.getSavedWords().then(function() {
        expect(console.error).toHaveBeenCalled();
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), "not valid json");
    });
  });
});
