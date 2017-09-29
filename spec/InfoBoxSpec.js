'use strict';

describe("InfoBox", function() {
  describe("has basic stats", function() {
    let infoBox;

    beforeEach(function() {
      const elements = dom.createElement("div", {},
        dom.createElement("p", {}, "Esta es una frase."),
        dom.createElement("p", {}, "Y esta es otra.")
      );
      const page = new Page(Language.SPANISH, elements);

      infoBox = new InfoBox(page);
    });

    it("shows count of total words", function() {
      expect(infoBox.element).toHaveText("8 words");
    });

    it("shows count of unique words", function() {
      expect(infoBox.element).toHaveText("6 unique");
    });

    it("shows count of known words", function() {
      pending("TODO");
    });

    it("shows percent words known", function() {
      expect(infoBox.element).toHaveText("0% words known");
    });

    it("shows percent page known", function() {
      expect(infoBox.element).toHaveText("0% page known");
    });

    it("shows language code", function() {
      expect(infoBox.element).toHaveText("language: ES");
    });

    it("updates stats", function() {
      infoBox.addKnownWord(Word.create("es"));
      expect(infoBox.element).toHaveText("17% words known");
      expect(infoBox.element).toHaveText("25% page known");
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

    it("shows percent words known", function(asyncDone) {
      const records = fakeFieldbookRecords(["es", "y"]);
      const page = new Page(Language.SPANISH, elements);

      page.waitForSavedData().then(function() {
        const infoBox = new InfoBox(page);
        expect(infoBox.element).toHaveText("33% words known");
        expect(infoBox.element).toHaveText("38% page known");
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), records);
    });

    it("considers the page well-known at >= 95% known", function(asyncDone) {
      const records = fakeFieldbookRecords(["esta", "es", "una", "frase", "y", "otra"]);
      const page = new Page(Language.SPANISH, elements);

      page.waitForSavedData().then(function() {
        const infoBox = new InfoBox(page);
        expect(infoBox.element.classList).toContain("well-known");
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), records);
    });

    it("considers the page known at >= 85% known", function(asyncDone) {
      const records = fakeFieldbookRecords(["esta", "es", "una", "frase", "y"]);
      const page = new Page(Language.SPANISH, elements);

      page.waitForSavedData().then(function() {
        const infoBox = new InfoBox(page);
        expect(infoBox.element.classList).toContain("known");
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), records);
    });

    it("considers the page somewhat-known at >= 75% known", function(asyncDone) {
      const records = fakeFieldbookRecords(["esta", "es", "una", "frase"]);
      const page = new Page(Language.SPANISH, elements);

      page.waitForSavedData().then(function() {
        const infoBox = new InfoBox(page);
        expect(infoBox.element.classList).toContain("somewhat-known");
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), records);
    });

    it("considers the page unknown at < 75% known", function(asyncDone) {
      const records = fakeFieldbookRecords(["esta"]);
      const page = new Page(Language.SPANISH, elements);

      page.waitForSavedData().then(function() {
        const infoBox = new InfoBox(page);
        expect(infoBox.element.classList).toContain("unknown");
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), records);
    });
  });
});
