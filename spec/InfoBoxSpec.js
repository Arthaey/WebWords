'use strict';

describe("InfoBox", function() {
  let stats;

  beforeEach(function() {
    stats = new Statistics();
  });

  it("defaults to unknown language with no button", function() {
    const infoBox = new InfoBox();
    expect(infoBox.element).not.toHaveText("mark up words");
  });

  it("shows the language and a button", function() {
    const infoBox = new InfoBox(Language.SPANISH);

    expect(infoBox.element).toHaveText("ES: mark up words");
  });

  it("updates with given statistics", function() {
    const infoBox = new InfoBox(Language.SPANISH);
    expect(infoBox.element).not.toHaveText("8 words");

    infoBox.update(new Statistics({
      totalKnownWordCount: 0,
      totalWordCount: 8,
      uniqueKnownWordCount: 0,
      uniqueWordCount: 6,
    }));

    expect(infoBox.element).toHaveText("language: ES");
    expect(infoBox.element).toHaveText("0 known / 8 total");
    expect(infoBox.element).toHaveText("0 known / 6 unique");
    expect(infoBox.element).toHaveText("0% page known");
    expect(infoBox.element).toHaveText("0% words known");

    infoBox.update(new Statistics({
      totalKnownWordCount: 987,
      totalWordCount: 1234,
      uniqueKnownWordCount: 2,
      uniqueWordCount: 7,
    }));

    expect(infoBox.element).toHaveText("language: ES");
    expect(infoBox.element).toHaveText("987 known / 1,234 total");
    expect(infoBox.element).toHaveText("2 known / 7 unique");
    expect(infoBox.element).toHaveText("80% page known");
    expect(infoBox.element).toHaveText("29% words known");
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

    it("considers the page well-known at >= 90% known", function() {
      const infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(90));
      expect(infoBox.element.classList).toContain("well-known");
    });

    it("considers the page known at >= 75% known", function() {
      const infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(75));
      expect(infoBox.element.classList).toContain("known");
    });

    it("considers the page somewhat-known at >= 50% known", function() {
      const infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(50));
      expect(infoBox.element.classList).toContain("somewhat-known");
    });

    it("considers the page unknown at < 50% known", function() {
      const infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(49));
      expect(infoBox.element.classList).toContain("unknown");
    });

    it("updates when percent changes", function() {
      const infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(90));
      expect(infoBox.element.classList).toContain("well-known");
      expect(infoBox.element.classList).not.toContain("known");
      infoBox.update(createStats(75));
      expect(infoBox.element.classList).not.toContain("well-known");
      expect(infoBox.element.classList).toContain("known");
    });
  });
});
