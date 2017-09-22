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

  it("creates a Word for each paragraph", function() {
    const uno = dom.createElement("p", {}, "uno");
    const dos = dom.createElement("p", {}, "dos");
    const elements = dom.createElement("div", {},
      uno,
      dos,
    );
    const page = new Page(elements);

    expect(page.words.length).toBe(2);
    expect(page.words).toContain(new Word(uno));
    expect(page.words).toContain(new Word(dos));
  });

  it("counts unique words", function() {
    const elements = dom.createElement("div", {},
      dom.createElement("p", {}, "uno"),
      dom.createElement("p", {}, "dos"),
      dom.createElement("p", {}, "uno"),
    );
    const page = new Page(elements);

    expect(Object.keys(page.uniqueWords).length).toBe(2);
    expect(page.uniqueWords["uno"]).toBe(2);
    expect(page.uniqueWords["dos"]).toBe(1);
    expect(page.uniqueWords["tres"]).toBeUndefined();
  });
});
