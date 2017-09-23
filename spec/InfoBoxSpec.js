'use strict';

describe("InfoBox", function() {
  afterEach(function() {
    dom.cleanup();
  });

  it("adds exactly one stylesheet", function() {
    const startingCount = document.head.querySelectorAll("style").length;
    new InfoBox();
    new InfoBox();
    const endingCount = document.head.querySelectorAll("style").length;

    expect(endingCount).toBe(startingCount + 1);
  });

  describe("has basic stats", function() {
    let infoBox;

    beforeEach(function() {
      const elements = dom.createElement("div", {},
        dom.createElement("p", {}, "Esta es una frase."),
        dom.createElement("p", {}, "Y esta es otra."),
      );
      const page = new Page("es", elements);

      infoBox = new InfoBox(page);
    });

    it("is in the upper right corner", function() {
      expect(infoBox.element).toHaveStyle("position", "absolute");
      expect(infoBox.element).toHaveStyle("top", "0px");
      expect(infoBox.element).toHaveStyle("right", "0px");
    });

    it("shows count of total words", function() {
      expect(infoBox.element).toHaveText("8 words");
    });

    it("shows count of unique words", function() {
      expect(infoBox.element).toHaveText("6 unique");
    });

    it("shows percent words known", function() {
      expect(infoBox.element).toHaveText("0% known");
    });

    it("shows language code", function() {
      expect(infoBox.element).toHaveText("ES: ");
    });
  });
});
