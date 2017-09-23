'use strict';

describe("Page", function() {
  afterEach(function() {
    dom.cleanup();
  });

  it("starts with no words", function(asyncDone) {
    const page = new Page();
    expect(page.langCode).toBeNull();
    expect(page.totalWordCount).toBe(0);
    expect(page.uniqueWordCount).toBe(0);
    expect(page.knownWordCount).toBe(0);
    expect(page.words).toBeEmpty();
    page.loaded().then(function(returnedPage) {
      expect(returnedPage).toEqual(page);
      asyncDone();
    });
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
      dom.createElement("article", {}, "ocho"),
    );
    const page = new Page("es", elements);

    expect(page.langCode).toEqual("es");
    expect(page.totalWordCount).toBe(8);
    expect(page.uniqueWordCount).toBe(8);
    expect(page.knownWordCount).toBe(0);
    expect(page.words["uno"]).toEqual([new Word("uno")]);
    expect(page.words["dos"]).toEqual([new Word("dos")]);
    expect(page.words["tres"]).toEqual([new Word("tres")]);
    expect(page.words["cuatro"]).toEqual([new Word("cuatro")]);
    expect(page.words["cinco"]).toEqual([new Word("cinco")]);
    expect(page.words["seis"]).toEqual([new Word("seis")]);
    expect(page.words["siete"]).toEqual([new Word("siete")]);
    expect(page.words["ocho"]).toEqual([new Word("ocho")]);
  });

  it("counts unique words", function() {
    const elements = dom.createElement("div", {},
      dom.createElement("p", {}, "uno"),
      dom.createElement("p", {}, "dos"),
      dom.createElement("p", {}, "tres dos uno"),
    );

    const page = new Page("es", elements);

    expect(page.totalWordCount).toBe(5);
    expect(page.uniqueWordCount).toBe(3);
    expect(page.knownWordCount).toBe(0);
    expect(page.words["uno"].length).toBe(2);
    expect(page.words["dos"].length).toBe(2);
    expect(page.words["tres"].length).toBe(1);
    expect(page.words["cuatro"]).toBeUndefined();
  });

  it("wraps each word in an element", function() {
    const text = "uno dos tres";
    const element = dom.createElement("p", {}, text);
    const expectedHTML =
      '<span class="L1 unknown">uno</span> ' +
      '<span class="L1 unknown">dos</span> ' +
      '<span class="L1 unknown">tres</span>';

    const page = new Page("es", element);

    expect(page.elements.length).toBe(1);
    expect(page.elements[0].innerText).toEqual(text);
    expect(page.elements[0].innerHTML).toEqual(expectedHTML);
  });

  it("preserves displayed case and punctuation", function() {
    const text = "'¿Uno, dos?'";
    const element = dom.createElement("p", {}, text);

    const page = new Page("es", element);

    expect(page.elements.length).toBe(1);
    expect(page.elements[0].innerText).toEqual(text);
    expect(page.totalWordCount).toBe(2);
    expect(page.uniqueWordCount).toBe(2);
    expect(page.knownWordCount).toBe(0);
    expect(page.words["uno"]).toEqual([new Word("uno")]);
    expect(page.words["dos"]).toEqual([new Word("dos")]);
  });
  });
});
