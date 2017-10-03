'use strict';

describe("InfoBox", function() {
  let stats;
  let infoBox;

  beforeEach(function() {
    stats = new Statistics();
  });

  afterEach(function() {
    if (infoBox) infoBox.destroy();
  });

  it("defaults to unknown language with no button", function() {
    infoBox = new InfoBox();
    expect(infoBox.element).not.toHaveText("mark up words");
  });

  it("shows the language and a button", function() {
    infoBox = new InfoBox(Language.SPANISH);

    expect(infoBox.element).toHaveText("ES: mark up words");
  });

  it("updates with given statistics", function() {
    infoBox = new InfoBox(Language.SPANISH);
    expect(infoBox.element).not.toHaveText("8 words");

    infoBox.update(new Statistics({
      totalKnownWordCount: 0,
      totalWordCount: 8,
      uniqueKnownWordCount: 0,
      uniqueWordCount: 6,
    }));

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

    expect(infoBox.element).toHaveText("987 known / 1,234 total");
    expect(infoBox.element).toHaveText("2 known / 7 unique");
    expect(infoBox.element).toHaveText("80% page known");
    expect(infoBox.element).toHaveText("29% words known");
  });

  it("calls handler after clicking the button", function(asyncDone) {
    const stats = new Statistics({ totalKnownWordCount: 8 });
    infoBox = new InfoBox(Language.SPANISH);
    spyOn(infoBox, "update");

    expect(infoBox.element).not.toHaveText("8 words");

    infoBox.addMarkUpPageHandler(function() {
      asyncDone();
      return Promise.resolve(stats);
    });

    infoBox.element.querySelector("button").click();
  });

  it("destroys itself", function() {
    infoBox = new InfoBox();
    const className = "." + InfoBox.className;

    expect(document.body.querySelectorAll(className).length).toBe(1);
    expect(infoBox.element).not.toBeUndefined();
    expect(infoBox.element).not.toBeNull();

    infoBox.destroy();

    expect(document.body.querySelectorAll(className)).toBeEmpty();
    expect(infoBox.element).toBeNull();
  });

  describe("styles itself depending on percent known", function() {
    function createStats(percentKnown) {
      return new Statistics({
        totalKnownWordCount: percentKnown,
        totalWordCount: 100,
      });
    }

    it("sets green background when 100% known", function() {
      infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(100));

      expect(infoBox.element).toHaveStyle("background-color", "rgb(230, 255, 232)");
      expect(infoBox.element).toHaveStyle("border-color", "rgb(0, 127, 10)");
    });

    it("sets red background when 0% known", function() {
      infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(0));

      expect(infoBox.element).toHaveStyle("background-color", "rgb(255, 230, 230)");
      expect(infoBox.element).toHaveStyle("border-color", "rgb(127, 0, 0)");
    });

    it("sets red background when 0% known", function() {
      infoBox = new InfoBox(Language.SPANISH);
      infoBox.update(createStats(42));

      expect(infoBox.element).toHaveStyle("background-color", "rgb(255, 241, 230)");
      expect(infoBox.element).toHaveStyle("border-color", "rgb(127, 55, 0)");
    });
  });
});
