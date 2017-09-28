'use strict';

describe("Page", function() {
  it("starts with no words", function() {
    const page = new Page();
    expect(page.langCode).toEqual(Language.UNKNOWN);
    expect(page.totalWordCount).toBe(0);
    expect(page.uniqueWordCount).toBe(0);
    expect(page.totalKnownWordCount).toBe(0);
    expect(page.uniqueKnownWordCount).toBe(0);
    expect(page.words).toBeEmpty();
    expect(page.infoBox).toBeNull();
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
    expect(page.totalWordCount).toBe(8);
    expect(page.uniqueWordCount).toBe(8);
    expect(page.totalKnownWordCount).toBe(0);
    expect(page.uniqueKnownWordCount).toBe(0);
    expect(page.words["uno"].occurrences.length).toBe(1);
    expect(page.words["dos"].occurrences.length).toBe(1);
    expect(page.words["tres"].occurrences.length).toBe(1);
    expect(page.words["cuatro"].occurrences.length).toBe(1);
    expect(page.words["cinco"].occurrences.length).toBe(1);
    expect(page.words["seis"].occurrences.length).toBe(1);
    expect(page.words["siete"].occurrences.length).toBe(1);
    expect(page.words["ocho"].occurrences.length).toBe(1);
  });

  it("counts unique words", function() {
    const elements = dom.createElement("div", {},
      dom.createElement("p", {}, "uno"),
      dom.createElement("p", {}, "dos"),
      dom.createElement("p", {}, "tres dos uno")
    );

    const page = new Page(Language.SPANISH, elements);

    expect(page.totalWordCount).toBe(5);
    expect(page.uniqueWordCount).toBe(3);
    expect(page.totalKnownWordCount).toBe(0);
    expect(page.uniqueKnownWordCount).toBe(0);
    expect(page.words["uno"].occurrences.length).toBe(2);
    expect(page.words["dos"].occurrences.length).toBe(2);
    expect(page.words["tres"].occurrences.length).toBe(1);
    expect(page.words["cuatro"]).toBeUndefined();
  });

  it("wraps each word in an element", function() {
    const text = "uno dos tres";
    const element = dom.createElement("p", {}, text);
    const expectedHTML =
      '<span class="L2 unknown">uno</span> ' +
      '<span class="L2 unknown">dos</span> ' +
      '<span class="L2 unknown">tres</span>';

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

  it("calculates percent of known words", function() {
    Word.create("dos", "known");
    const element = dom.createElement("p", {}, "uno dos tres cuatro tres dos");

    const page = new Page(Language.SPANISH, element);

    expect(page.totalWordCount).toBe(6);
    expect(page.uniqueWordCount).toBe(4);
    expect(page.totalKnownWordCount).toBe(2);
    expect(page.uniqueKnownWordCount).toBe(1);
    expect(page.percentKnownUniqueWords()).toBe(25); // 1 out of 4
    expect(page.percentKnownPageWords()).toBe(33); // 2 out of 6
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
          "record_url": "https://fieldbook.com/records/abc",
          "word": "es",
          "how_well_known": "known"
        },
        {
          "id": 2,
          "record_url": "https://fieldbook.com/records/xyz",
          "word": "y",
          "how_well_known": "known"
        }
      ]`;

      const page = new Page(Language.SPANISH, elements);

      expect(page.totalWordCount).toBe(8);
      expect(page.uniqueWordCount).toBe(6);
      expect(page.totalKnownWordCount).toBe(0);
      expect(page.uniqueKnownWordCount).toBe(0);

      expect(page.words["es"].occurrences[0].classList).toContain("unknown");
      expect(page.words["es"].occurrences[1].classList).toContain("unknown");
      expect(page.words["y"].occurrences[0].classList).toContain("unknown");

      page.waitForSavedData().then(function() {
        expect(page.totalWordCount).toBe(8);
        expect(page.uniqueWordCount).toBe(6);
        expect(page.totalKnownWordCount).toBe(3);
        expect(page.uniqueKnownWordCount).toBe(2);

        expect(page.words["es"].occurrences[0].classList).toContain("known");
        expect(page.words["es"].occurrences[1].classList).toContain("known");
        expect(page.words["y"].occurrences[0].classList).toContain("known");
        asyncDone();
      });

      mockAjaxRequest(FIELDBOOK_URL + Language.SPANISH, json);
    });

    it("adds Fieldbook IDs to words ", function(asyncDone) {
      const page = new Page(Language.SPANISH, elements);
      const word = page.words["y"];

      expect(word.fieldbookId).toBeNull();

      page.waitForSavedData().then(function() {
        expect(word.fieldbookId).not.toBeNull();
        asyncDone();
      });

      const records = fakeFieldbookRecords(["y"]);
      mockAjaxRequest(FIELDBOOK_URL + Language.SPANISH, records);
    });

    it("marks a word as known when text is clicked", function() {
      const page = new Page(Language.SPANISH, elements);
      spyOn(Fieldbook, "createRecord");

      page.words["y"].occurrences[0].click();

      expect(Fieldbook.createRecord).toHaveBeenCalled();
    });

    it("updates Fieldbook when marking a word as known", function(asyncDone) {
      const page = new Page(Language.SPANISH, elements);
      const word = page.words["y"];

      page.waitForSavedData().then(function() {
        expect(word.occurrences[0].classList).toContain("unknown");
        expect(word.fieldbookId).toBeNull();
      })
      .then(function() {
        const records = fakeFieldbookRecords(["y"]);
        const promise = page.markAsKnown(word);
        mockAjaxRequest(FIELDBOOK_URL + Language.SPANISH, records);
        return promise;
      })
      .then(function() {
        expect(word.occurrences[0].classList).toContain("known");
        expect(word.fieldbookId).not.toBeNull();
        asyncDone();
      });

      mockAjaxRequest(FIELDBOOK_URL + Language.SPANISH, "[]");
    });

    it("creates an InfoBox", function(asyncDone) {
      const page = new Page(Language.SPANISH, elements);
      expect(page.infoBox).toBeNull();

      page.waitForSavedData().then(function() {
        expect(page.infoBox).not.toBeNull();
        asyncDone();
      });

      mockAjaxRequest(FIELDBOOK_URL + Language.SPANISH, "[]");
    });

    it("does not blow up on bad Fieldbook records", function(asyncDone) {
      const page = new Page(Language.SPANISH, elements);

      page.waitForSavedData().then(function() {
        asyncDone();
      });

      mockAjaxRequest(FIELDBOOK_URL + Language.SPANISH, "not valid json");
    });

    it("does not request data if no key set", function(asyncDone) {
      localStorage.removeItem(WebWords.fieldbookKeyId);
      localStorage.setItem(WebWords.fieldbookSecretId, "something");

      const page = new Page(Language.SPANISH, elements);

      page.waitForSavedData().catch(function(errorMsg) {
        expect(errorMsg).toContain("missing Fieldbook key and/or secret");
        expect(jasmine.Ajax.requests.mostRecent()).toBeUndefined();
        asyncDone();
      });
    });

    it("does not request data if no secret set", function(asyncDone) {
      localStorage.removeItem(WebWords.fieldbookSecretId);
      localStorage.setItem(WebWords.fieldbookKeyId, "something");

      const page = new Page(Language.SPANISH, elements);

      page.waitForSavedData().catch(function(errorMsg) {
        expect(errorMsg).toContain("missing Fieldbook key and/or secret");
        expect(jasmine.Ajax.requests.mostRecent()).toBeUndefined();
        asyncDone();
      });
    });
  });
});
