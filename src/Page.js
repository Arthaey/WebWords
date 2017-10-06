'use strict';

const Constants = require("src/Constants.js");
const Fieldbook = require("src/Fieldbook.js");
const InfoBox = require("src/InfoBox.js");
const Language = require("src/Language.js");
const Statistics = require("src/Statistics.js");
const Word = require("src/Word.js");

const Page = function(langCode, rootElement) {
  this.langCode = langCode || Language.UNKNOWN;
  this.rootElement = rootElement;
  this.fieldbook = new Fieldbook();

  this.reset();
  this.parseWords();
};

Page.prototype.reset = function() {
  this.destroy();

  this.words = [];
  this.stats = new Statistics();

  this.infoBox = new InfoBox(this.langCode);
  this.infoBox.addMarkUpPageHandler(this.getSavedWords.bind(this));
};

Page.prototype.destroy = function() {
  if (this.infoBox) {
    this.infoBox.destroy();
    this.infoBox = null;
  }
};

Page.prototype.markAsKnown = function(word) {
  if (word.learningStatus === Word.KNOWN) {
    return Promise.resolve([]);
  }

  word.markAsKnown();
  word.removeClickHandlers();

  this.stats.totalKnownWordCount += word.occurrences.length;
  this.stats.uniqueKnownWordCount += 1;
  this.infoBox.update(this.stats);

  return this.fieldbook.createRecord(this.langCode, word);
};

Page.prototype.parseWords = function() {
  if (!this.rootElement || this.langCode === Language.UNKNOWN) return;

  const thisPage = this;

  this.reset();

  const originalContainer = this.rootElement.parentNode;
  const rootContainerElement = document.createElement("div");
  rootContainerElement.appendChild(this.rootElement);

  const tagsWithText = "h1, h2, h3, h4, h5, h6, article, p:not(.webwords-ignore)";
  const elements = rootContainerElement.querySelectorAll(tagsWithText);
  this.wrapElements(elements);

  originalContainer.appendChild(this.rootElement);
};

Page.prototype.wrapElements = function(elements) {
  const thisPage = this;
  elements.forEach(function(element) {
    if (element.nodeType === Node.TEXT_NODE) {
      thisPage.wrapText(element);
    } else {
      const nonLiveChildNodes = [].slice.call(element.childNodes);
      thisPage.wrapElements(nonLiveChildNodes);
    }
  });
};

Page.prototype.wrapText = function(element) {
  const texts = Page.splitText(element);
  const wrappedWords = texts.map(this.wrapWord, this);
  const parentNode = element.parentNode;

  wrappedWords.forEach(function(wrappedWord) {
    element.parentNode.insertBefore(wrappedWord, element);
  });
  element.parentNode.removeChild(element);
};

Page.splitText = function(element) {
  const texts = element.textContent.split(Constants.splitRegex);
  return texts.filter(function(text) {
    return text !== "";
   });
};

Page.prototype.getSavedWords = function() {
  const thisPage = this;
  const thisInfoBox = this.infoBox;

  return this.fieldbook.getRecords(this.langCode)
    .then(thisPage.parseSavedData.bind(thisPage))
    .then(thisInfoBox.update.bind(thisInfoBox, thisPage.stats))
};

Page.prototype.wrapWord = function(text) {
  let element;

  if (text.match(Constants.splitRegex) || text.match(Constants.ignoreRegex)) {
    // punctuation, spaces, etc
    element = document.createTextNode(text);
  } else {
    element = document.createElement("span");
    element.innerHTML = text;
    this.addWord(element);
  }

  return element;
};

Page.prototype.addWord = function(element) {
  const thisPage = this;
  const word = Word.create(element);
  const isNew = !this.words[word.text];
  const isKnown = (word.learningStatus === Word.KNOWN);

  this.stats.totalWordCount += 1;
  if (isNew) this.stats.uniqueWordCount += 1;
  if (isKnown) this.stats.totalKnownWordCount += 1;
  if (isNew && isKnown) this.stats.uniqueKnownWordCount += 1;

  word.addClickHandler(element, function(e) {
    e.preventDefault();
    thisPage.markAsKnown(word);
  });

  this.words[word.text] = word;
};

Page.prototype.parseSavedData = function(records) {
  const thisPage = this;

  records.forEach(function(record) {
    const wordOnPage = thisPage.words[record.word];
    if (!wordOnPage) return;

    wordOnPage.dataStoreId = record.id;

    if (wordOnPage.learningStatus !== Word.KNOWN && record.how_well_known === Word.KNOWN) {
      thisPage.stats.uniqueKnownWordCount += 1;
      thisPage.stats.totalKnownWordCount += wordOnPage.occurrences.length;
      wordOnPage.markAsKnown();
    }
  });

  this._unverifiedWords().forEach(function(word) {
    word.markAsUnknown();
  });
};

Page.prototype._unverifiedWords = function() {
  const thisPage = this;
  const unverifiedWords = [];

  Object.keys(this.words).forEach(function(text) {
    const word = thisPage.words[text];
    if (word.learningStatus === Word.UNVERIFIED) {
      unverifiedWords.push(word);
    }
  });

  return unverifiedWords;
};

module.exports = Page;
