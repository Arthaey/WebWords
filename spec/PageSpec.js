'use strict';

describe("Page", function() {
  afterEach(function() {
    dom.cleanup();
  });

  it("starts with no words", function() {
    const page = new Page();
    expect(page.words).toBeEmpty();
    expect(page.uniqueWords).toBeEmpty();
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
    const page = new Page(elements);

    expect(page.words.length).toBe(8);
    expect(page.words).toContain(new Word(dom.createElement("h1", {}, "uno")));
    expect(page.words).toContain(new Word(dom.createElement("h2", {}, "dos")));
    expect(page.words).toContain(new Word(dom.createElement("h3", {}, "tres")));
    expect(page.words).toContain(new Word(dom.createElement("h4", {}, "cuatro")));
    expect(page.words).toContain(new Word(dom.createElement("h5", {}, "cinco")));
    expect(page.words).toContain(new Word(dom.createElement("h6", {}, "seis")));
    expect(page.words).toContain(new Word(dom.createElement("p", {}, "siete")));
    expect(page.words).toContain(new Word(dom.createElement("article", {}, "ocho")));
  });

  it("counts unique words", function() {
    const elements = dom.createElement("div", {},
      dom.createElement("p", {}, "uno"),
      dom.createElement("p", {}, "dos"),
      dom.createElement("p", {}, "tres dos uno"),
    );

    const page = new Page(elements);

    expect(Object.keys(page.uniqueWords).length).toBe(3);
    expect(page.uniqueWords["uno"]).toBe(2);
    expect(page.uniqueWords["dos"]).toBe(2);
    expect(page.uniqueWords["tres"]).toBe(1);
    expect(page.uniqueWords["cuatro"]).toBeUndefined();
  });

  it("wraps each word in an element", function() {
    const text = "uno dos tres";
    const element = dom.createElement("p", {}, text);
    const expectedHTML =
      '<span class="L1 unknown">uno</span> ' +
      '<span class="L1 unknown">dos</span> ' +
      '<span class="L1 unknown">tres</span>';

    const page = new Page(element);

    expect(page.elements.length).toBe(1);
    expect(page.elements[0].innerText).toEqual(text);
    expect(page.elements[0].innerHTML).toEqual(expectedHTML);
  });

  it("preserves displayed case and punctuation", function() {
    const text = "'¿Uno, dos?'";
    const element = dom.createElement("p", {}, text);

    const page = new Page(element);

    expect(page.elements.length).toBe(1);
    expect(page.elements[0].innerText).toEqual(text);
    expect(Object.keys(page.uniqueWords).length).toBe(2);
    expect(page.uniqueWords["uno"]).toBe(1);
    expect(page.uniqueWords["dos"]).toBe(1);
  });
});
