'use strict';

const Fieldbook = require("src/Fieldbook.js");
const Language = require("src/Language.js");

describe("Fieldbook", function() {
  let fieldbook;

  beforeEach(function() {
    fieldbook = new Fieldbook();
  });

  function removeFieldbookLocalStorageItems() {
    localStorage.removeItem(Fieldbook.CONFIG_BOOK);
    localStorage.removeItem(Fieldbook.CONFIG_KEY);
    localStorage.removeItem(Fieldbook.CONFIG_SECRET);
  }

  function setFieldbookLocalStorageItems() {
    localStorage.setItem(Fieldbook.CONFIG_BOOK, "foo");
    localStorage.setItem(Fieldbook.CONFIG_KEY, "bar");
    localStorage.setItem(Fieldbook.CONFIG_SECRET, "qux");
  }

  it("constructor has a base url", function() {
    expect(fieldbook.baseUrl).toContain("example.com");
  });

  it("generates a url from a language code", function() {
    const expectedUrl = "http://example.com/test-fieldbook-book/es";
    expect(fieldbook.getUrl(Language.SPANISH)).toEqual(expectedUrl);
  });

  describe("getAuthToken", function() {
    it("returns a token when all required info is set", function() {
      removeFieldbookLocalStorageItems();
      localStorage.setItem(Fieldbook.CONFIG_BOOK, "foo");
      localStorage.setItem(Fieldbook.CONFIG_KEY, "bar");
      localStorage.setItem(Fieldbook.CONFIG_SECRET, "qux");

      expect(fieldbook.getAuthToken()).not.toBeUndefined();
      expect(fieldbook.getAuthToken()).not.toBeNull();
    });

    it("returns null when book is missing", function() {
      removeFieldbookLocalStorageItems();
      localStorage.setItem(Fieldbook.CONFIG_KEY, "bar");
      localStorage.setItem(Fieldbook.CONFIG_SECRET, "qux");

      expect(fieldbook.getAuthToken()).toBeNull();
    });

    it("returns null when key is missing", function() {
      removeFieldbookLocalStorageItems();
      localStorage.setItem(Fieldbook.CONFIG_BOOK, "foo");
      localStorage.setItem(Fieldbook.CONFIG_SECRET, "qux");

      expect(fieldbook.getAuthToken()).toBeNull();
    });

    it("returns null when secret is missing", function() {
      removeFieldbookLocalStorageItems();
      localStorage.setItem(Fieldbook.CONFIG_BOOK, "foo");
      localStorage.setItem(Fieldbook.CONFIG_KEY, "bar");

      expect(fieldbook.getAuthToken()).toBeNull();
    });
  });
});
