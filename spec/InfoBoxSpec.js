'use strict';

describe("InfoBox", function() {
  let stats;

  beforeEach(function() {
    stats = new Statistics();
  });

  it("defaults to unknown language with no button", function() {
    const infoBox = new InfoBox();
    expect(infoBox.element).toHaveText("identified ??");
    expect(infoBox.element).not.toHaveText("Mark up words");
  });

  it("shows the language and a button", function() {
    const infoBox = new InfoBox(Language.SPANISH);

    expect(infoBox.element).toHaveText("identified ES");
    expect(infoBox.element).toHaveText("Mark up words");
  });

  it("updates with given statistics", function() {
    const infoBox = new InfoBox(Language.SPANISH);
    expect(infoBox.element).not.toHaveText("8 words");

    infoBox.update(new Statistics({
      totalWordCount: 8,
      uniqueWordCount: 6,
      totalKnownWordCount: 0,
      uniqueKnownWordCount: 0,
    }));

    expect(infoBox.element).toHaveText("language: ES");
    expect(infoBox.element).toHaveText("8 words");
    expect(infoBox.element).toHaveText("6 unique");
    expect(infoBox.element).toHaveText("0% words known");
    expect(infoBox.element).toHaveText("0% page known");

    infoBox.update(new Statistics({
      totalWordCount: 9,
      uniqueWordCount: 7,
      totalKnownWordCount: 3,
      uniqueKnownWordCount: 2,
    }));

    expect(infoBox.element).toHaveText("language: ES");
    expect(infoBox.element).toHaveText("9 words");
    expect(infoBox.element).toHaveText("7 unique");
    expect(infoBox.element).toHaveText("29% words known");
    expect(infoBox.element).toHaveText("33% page known");
  });

  it("calls handler after clicking the button", function(asyncDone) {
    const stats = new Statistics({ totalKnownWordCount: 8 });
    const infoBox = new InfoBox(Language.SPANISH);
    spyOn(infoBox, "update");

    expect(infoBox.element).not.toHaveText("8 words");

    infoBox.addMarkUpPageHandler(function() {
      asyncDone();
      return Promise.resolve(stats);
    });

    infoBox.element.querySelector("button").click();
  });

  describe("styles itself depending on percent known", function() {
    function createStats(percentKnown) {
      return new Statistics({
        totalKnownWordCount: percentKnown,
        totalWordCount: 100,
      });
    }

    it("considers the page well-known at >= 95% known", function() {
      const infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(95));
      expect(infoBox.element.classList).toContain("well-known");
    });

    it("considers the page known at >= 85% known", function() {
      const infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(85));
      expect(infoBox.element.classList).toContain("known");
    });

    it("considers the page somewhat-known at >= 75% known", function() {
      const infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(75));
      expect(infoBox.element.classList).toContain("somewhat-known");
    });

    it("considers the page unknown at < 75% known", function() {
      const infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(74));
      expect(infoBox.element.classList).toContain("unknown");
    });

    it("updates when percent changes", function() {
      const infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(95));
      expect(infoBox.element.classList).toContain("well-known");
      expect(infoBox.element.classList).not.toContain("known");
      infoBox.update(createStats(85));
      expect(infoBox.element.classList).not.toContain("well-known");
      expect(infoBox.element.classList).toContain("known");
    });
  });
});
