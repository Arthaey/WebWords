'use strict';

const DataStore = require("src/DataStore.js");
const Word = require("src/Word.js");

describe("DataStore", function() {
  let dataStore;
  let authToken;

  const FakeDataStore = function() {
    DataStore.call(this, "http://fakedatastore.example.com");
  };
  FakeDataStore.prototype = Object.create(DataStore.prototype);
  FakeDataStore.prototype.constructor = FakeDataStore;
  FakeDataStore.prototype.getAuthToken = function() { return authToken };

  beforeEach(function() {
    dataStore = new FakeDataStore();
    authToken = null;
  });

  describe("constructor", function() {
    it("can be instantiated as a subclass", function() {
      expect(dataStore.baseUrl).toBe("http://fakedatastore.example.com");
    });

    it("cannot be instantiated directly", function() {
      /* eslint no-new: "off" */
      expect(function() { new DataStore() }).toThrowError(/subclass/);
    });

    it("requires getAuthToken to be implementedy by the subclass", function() {
      const IncompleteFakeDataStore = function() {
        DataStore.call(this, "http://fakedatastore.example.com");
      };
      IncompleteFakeDataStore.prototype = Object.create(DataStore.prototype);
      IncompleteFakeDataStore.prototype.constructor = IncompleteFakeDataStore;

      /* eslint no-new: "off" */
      expect(function() { new IncompleteFakeDataStore() }).toThrowError(/required methods/);
    });
  });

  it("handles errors with status text", function(asyncDone) {
    authToken = "token";
    spyOn(console, "error");

    dataStore.getRecords("test/path").then(function(records) {
      const errorMsg = "ERROR with http://fakedatastore.example.com/test/path: '404 Not Found'";
      expect(console.error).toHaveBeenCalledWith(errorMsg);
      expect(records).toBeEmpty();
      asyncDone();
    });

    const request = jasmine.Ajax.requests.mostRecent();
    request.responseError({ status: 404, statusText: "404 Not Found" });
  });

  describe("getRecords", function() {
    it("parses records", function(asyncDone) {
      authToken = "token";

      dataStore.getRecords("test/path").then(function(records) {
        expect(records.length).toBe(2);
        expect(records[0].word).toBe("foo");
        expect(records[1].word).toBe("bar");
        asyncDone();
      });

      const records = fakeFieldbookRecords(["foo", "bar"]);
      mockAjaxRequest(dataStore.getUrl("test/path"), records);
    });

    it("handles no records", function(asyncDone) {
      authToken = "token";

      dataStore.getRecords("test/path").then(function(records) {
        expect(records).toBeEmpty()
        asyncDone();
      });

      mockAjaxRequest(dataStore.getUrl("test/path"), "[]");
    });

    it("handles when records are invalid json", function(asyncDone) {
      authToken = "token";
      spyOn(console, "error");

      dataStore.getRecords("test/path").then(function(records) {
        expect(records).toBeEmpty();
        expect(console.error).toHaveBeenCalled();
        asyncDone();
      });

      mockAjaxRequest(dataStore.getUrl("test/path"), "invalid json");
    });

    it("does not request data if required info is missing", function(asyncDone) {
      dataStore.getRecords("test/path").catch(function(errorMsg) {
        expect(errorMsg).toContain("missing auth token");
        expect(jasmine.Ajax.requests.mostRecent()).toBeUndefined();
        asyncDone();
      });
    });
  });

  describe("createRecord", function() {
    it("creates a known word", function(asyncDone) {
      authToken = "token";
      const word = Word.create("palabra");

      expect(word.learningStatus).toBe(Word.UNVERIFIED);
      expect(word.dataStoreId).toBeNull();

      dataStore.createRecord("test/path", word).then(function(records) {
        expect(records.length).toBe(1);
        expect(records[0].word).toBe("palabra");
        expect(records[0].how_well_known).toBe("known");
        expect(word.learningStatus).toBe(Word.KNOWN);
        expect(word.dataStoreId).not.toBeNull();
        asyncDone();
      });

      const records = fakeFieldbookRecords(["palabra"]);
      mockAjaxRequest(dataStore.getUrl("test/path"), records);
    });

    it("handles when no record is returned", function(asyncDone) {
      authToken = "token";
      const word = Word.create("palabra");

      dataStore.createRecord("test/path", word).then(function(records) {
        expect(records).toBeEmpty()
        asyncDone();
      });

      mockAjaxRequest(dataStore.getUrl("test/path"), "[]");
    });

    it("does not send data if required info is missing", function(asyncDone) {
      const word = Word.create("palabra");

      expect(word.learningStatus).toBe(Word.UNVERIFIED);
      expect(word.dataStoreId).toBeNull();

      dataStore.createRecord("test/path", word).catch(function(errorMsg) {
        expect(errorMsg).toContain("missing auth token");
        expect(jasmine.Ajax.requests.mostRecent()).toBeUndefined();
        expect(word.learningStatus).toBe(Word.UNVERIFIED);
        expect(word.dataStoreId).toBeNull();
        asyncDone();
      });
    });
  });

  describe("updateRecord", function() {
    const expectedFieldbookId = 42;
    let word;

    beforeEach(function() {
      word = Word.create("palabra", "unknown");
      word.dataStoreId = expectedFieldbookId;
    });

    it("updates an existing word", function(asyncDone) {
      authToken = "token";

      expect(word.learningStatus).toBe(Word.UNKNOWN);
      expect(word.dataStoreId).toBe(expectedFieldbookId);

      dataStore.updateRecord("test/path", word).then(function(records) {
        expect(records.length).toBe(1);
        expect(word.learningStatus).toBe(Word.UNKNOWN);
        expect(word.dataStoreId).toBe(expectedFieldbookId);
        asyncDone();
      });

      const url = dataStore.getUrl("test/path") + "/" + expectedFieldbookId;
      const records = fakeFieldbookRecords(["cantTestFieldbookSideEffects"]);
      mockAjaxRequest(url, records);
    });

    it("handles when no record is returned", function(asyncDone) {
      authToken = "token";

      dataStore.updateRecord("test/path", word).then(function(records) {
        expect(records).toBeEmpty()
        asyncDone();
      });

      const url = dataStore.getUrl("test/path") + "/" + expectedFieldbookId;
      mockAjaxRequest(url, "[]");
    });

    it("does not send data if required info is missing", function(asyncDone) {
      dataStore.updateRecord("test/path", word).catch(function(errorMsg) {
        expect(errorMsg).toContain("missing auth token");
        expect(jasmine.Ajax.requests.mostRecent()).toBeUndefined();
        asyncDone();
      });
    });
  });
});
