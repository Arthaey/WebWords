'use strict';

const Fieldbook = require("../src/Fieldbook.js");
const Language = require("../src/Language.js");
const Word = require("../src/Word.js");

describe("Fieldbook", function() {
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

  it("constructor does nothing", function() {
    const fieldbook = new Fieldbook();
    expect(fieldbook).not.toBeUndefined();
    expect(fieldbook).not.toBeNull();
  });

  it("generates a url from a language code", function() {
    const expectedUrl = "http://example.com/test-fieldbook-book/es";
    expect(Fieldbook.getUrl(Language.SPANISH)).toEqual(expectedUrl);
  });

  it("handles errors with status text", function(asyncDone) {
    setFieldbookLocalStorageItems();
    spyOn(console, "error");

    Fieldbook.getRecords(Language.SPANISH).then(function(records) {
      const errorMsg = "ERROR with http://example.com/foo/es: '404 Not Found'";
      expect(console.error).toHaveBeenCalledWith(errorMsg);
      expect(records).toBeEmpty();
      asyncDone();
    });

    const request = jasmine.Ajax.requests.mostRecent();
    request.responseError({ status: 404, statusText: "404 Not Found" });
  });

  describe("getAuthToken", function() {
    it("returns a token when all required info is set", function() {
      removeFieldbookLocalStorageItems();
      localStorage.setItem(Fieldbook.CONFIG_BOOK, "foo");
      localStorage.setItem(Fieldbook.CONFIG_KEY, "bar");
      localStorage.setItem(Fieldbook.CONFIG_SECRET, "qux");

      expect(Fieldbook.getAuthToken()).not.toBeUndefined();
      expect(Fieldbook.getAuthToken()).not.toBeNull();
    });

    it("returns null when book is missing", function() {
      removeFieldbookLocalStorageItems();
      localStorage.setItem(Fieldbook.CONFIG_KEY, "bar");
      localStorage.setItem(Fieldbook.CONFIG_SECRET, "qux");

      expect(Fieldbook.getAuthToken()).toBeNull();
    });

    it("returns null when key is missing", function() {
      removeFieldbookLocalStorageItems();
      localStorage.setItem(Fieldbook.CONFIG_BOOK, "foo");
      localStorage.setItem(Fieldbook.CONFIG_SECRET, "qux");

      expect(Fieldbook.getAuthToken()).toBeNull();
    });

    it("returns null when secret is missing", function() {
      removeFieldbookLocalStorageItems();
      localStorage.setItem(Fieldbook.CONFIG_BOOK, "foo");
      localStorage.setItem(Fieldbook.CONFIG_KEY, "bar");

      expect(Fieldbook.getAuthToken()).toBeNull();
    });
  });

  describe("getRecords", function() {
    it("parses records", function(asyncDone) {
      setFieldbookLocalStorageItems();

      Fieldbook.getRecords(Language.SPANISH).then(function(records) {
        expect(records.length).toBe(2);
        expect(records[0].word).toBe("foo");
        expect(records[1].word).toBe("bar");
        asyncDone();
      });

      const records = fakeFieldbookRecords(["foo", "bar"]);
      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), records);
    });

    it("handles no records", function(asyncDone) {
      setFieldbookLocalStorageItems();

      Fieldbook.getRecords(Language.SPANISH).then(function(records) {
        expect(records).toBeEmpty()
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), "[]");
    });

    it("handles when records are invalid json", function(asyncDone) {
      setFieldbookLocalStorageItems();
      spyOn(console, "error");

      Fieldbook.getRecords(Language.SPANISH).then(function(records) {
        expect(records).toBeEmpty();
        expect(console.error).toHaveBeenCalled();
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), "invalid json");
    });

    it("does not request data if required info is missing", function(asyncDone) {
      removeFieldbookLocalStorageItems();

      Fieldbook.getRecords(Language.SPANISH).catch(function(errorMsg) {
        expect(errorMsg).toContain("missing Fieldbook book ID, key, or secret");
        expect(jasmine.Ajax.requests.mostRecent()).toBeUndefined();
        asyncDone();
      });
    });
  });

  describe("createRecord", function() {
    it("creates a known word", function(asyncDone) {
      setFieldbookLocalStorageItems();
      const word = Word.create("palabra");

      expect(word.learningStatus).toBe(Word.UNVERIFIED);
      expect(word.fieldbookId).toBeNull();

      Fieldbook.createRecord(Language.SPANISH, word).then(function(records) {
        expect(records.length).toBe(1);
        expect(records[0].word).toBe("palabra");
        expect(records[0].how_well_known).toBe("known");
        expect(word.learningStatus).toBe(Word.KNOWN);
        expect(word.fieldbookId).not.toBeNull();
        asyncDone();
      });

      const records = fakeFieldbookRecords(["palabra"]);
      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), records);
    });

    it("handles when no record is returned", function(asyncDone) {
      setFieldbookLocalStorageItems();
      const word = Word.create("palabra");

      Fieldbook.createRecord(Language.SPANISH, word).then(function(records) {
        expect(records).toBeEmpty()
        asyncDone();
      });

      mockAjaxRequest(Fieldbook.getUrl(Language.SPANISH), "[]");
    });

    it("does not send data if required info is missing", function(asyncDone) {
      removeFieldbookLocalStorageItems();
      const word = Word.create("palabra");

      expect(word.learningStatus).toBe(Word.UNVERIFIED);
      expect(word.fieldbookId).toBeNull();

      Fieldbook.createRecord(Language.SPANISH, word).catch(function(errorMsg) {
        expect(errorMsg).toContain("missing Fieldbook book ID, key, or secret");
        expect(jasmine.Ajax.requests.mostRecent()).toBeUndefined();
        expect(word.learningStatus).toBe(Word.UNVERIFIED);
        expect(word.fieldbookId).toBeNull();
        asyncDone();
      });
    });
  });

  describe("updateRecord", function() {
    const expectedFieldbookId = 42;
    let word;

    beforeEach(function() {
      word = Word.create("palabra", "unknown");
      word.fieldbookId = expectedFieldbookId;
    });

    it("updates an existing word", function(asyncDone) {
      setFieldbookLocalStorageItems();

      expect(word.learningStatus).toBe(Word.UNKNOWN);
      expect(word.fieldbookId).toBe(expectedFieldbookId);

      Fieldbook.updateRecord(Language.SPANISH, word).then(function(records) {
        expect(records.length).toBe(1);
        expect(word.learningStatus).toBe(Word.UNKNOWN);
        expect(word.fieldbookId).toBe(expectedFieldbookId);
        asyncDone();
      });

      const url = Fieldbook.getUrl(Language.SPANISH) + "/" + expectedFieldbookId;
      const records = fakeFieldbookRecords(["cantTestFieldbookSideEffects"]);
      mockAjaxRequest(url, records);
    });

    it("handles when no record is returned", function(asyncDone) {
      setFieldbookLocalStorageItems();

      Fieldbook.updateRecord(Language.SPANISH, word).then(function(records) {
        expect(records).toBeEmpty()
        asyncDone();
      });

      const url = Fieldbook.getUrl(Language.SPANISH) + "/" + expectedFieldbookId;
      mockAjaxRequest(url, "[]");
    });

    it("does not send data if required info is missing", function(asyncDone) {
      removeFieldbookLocalStorageItems();

      Fieldbook.updateRecord(Language.SPANISH, word).catch(function(errorMsg) {
        expect(errorMsg).toContain("missing Fieldbook book ID, key, or secret");
        expect(jasmine.Ajax.requests.mostRecent()).toBeUndefined();
        asyncDone();
      });
    });
  });
});
