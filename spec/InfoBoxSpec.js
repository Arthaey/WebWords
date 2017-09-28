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

    it("shows percent words known", function() {
      expect(infoBox.element).toHaveText("0% words known");
    });

    it("shows percent page known", function() {
      expect(infoBox.element).toHaveText("0% page known");
    });

    it("shows language code", function() {
      expect(infoBox.element).toHaveText("language: ES");
    });
  });

  describe("with saved data", function() {
    it("shows percent words known", function(asyncDone) {
      const url = "https://api.fieldbook.com/v1/sheetId/es";
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

      const elements = dom.createElement("div", {},
        dom.createElement("p", {}, "Esta es una frase."),
        dom.createElement("p", {}, "Y esta es otra.")
      );
      const page = new Page(Language.SPANISH, elements);

      page.waitForSavedData().then(function() {
        const infoBox = new InfoBox(page);
        expect(infoBox.element).toHaveText("33% words known");
        expect(infoBox.element).toHaveText("38% page known");
        asyncDone();
      });

      mockAjaxRequest(FIELDBOOK_URL + Language.SPANISH, json);
    });
  });
});
