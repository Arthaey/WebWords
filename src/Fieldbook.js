'use strict';

const DataStore = require("src/DataStore.js");

const Fieldbook = function() {
  DataStore.call(this, Fieldbook.BASE_URL);
};

Fieldbook.prototype = Object.create(DataStore.prototype);
Fieldbook.prototype.constructor = Fieldbook;

Fieldbook.BASE_URL = "https://api.fieldbook.com/v1";
Fieldbook.CONFIG_BOOK = "WebWords-FieldbookBook";
Fieldbook.CONFIG_KEY = "WebWords-FieldbookKey";
Fieldbook.CONFIG_SECRET = "WebWords-FieldbookSecret";

Fieldbook.prototype.getUrl = function(langCode) {
  const fieldbookBook = localStorage.getItem(Fieldbook.CONFIG_BOOK);
  return `${this.baseUrl}/${fieldbookBook}/${langCode}`;
};

Fieldbook.prototype.getAuthToken = function() {
  const fieldbookBook = localStorage.getItem(Fieldbook.CONFIG_BOOK);
  const fieldbookKey = localStorage.getItem(Fieldbook.CONFIG_KEY);
  const fieldbookSecret = localStorage.getItem(Fieldbook.CONFIG_SECRET);

  if (fieldbookBook && fieldbookKey && fieldbookSecret) {
    return btoa(`${fieldbookKey}:${fieldbookSecret}`);
  }
  return null;
};

module.exports = Fieldbook;
