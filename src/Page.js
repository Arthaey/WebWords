'use strict';

const Page = function(langCode, rootElement) {
  this.reset();
  this.langCode = langCode || Language.UNKNOWN;

  if (rootElement) {
    this.parseWords(rootElement);
  }
};

Page.prototype.reset = function() {
  this.infoBox = null;

  this.pageElements = [];
  this.words = [];

  this.totalWordCount = 0;
  this.uniqueWordCount = 0;
  this.totalKnownWordCount = 0;
  this.uniqueKnownWordCount = 0;
};

Page.prototype.markAsKnown = function(word) {
  word.markAsKnown();
  if (this.infoBox) {
    this.infoBox.addKnownWord(word);
  }
  return Fieldbook.createRecord(this.langCode, word);
};

Page.prototype.parseWords = function(rootElement) {
  let didLoadAndParse, failedToLoadAndParse;
  this._loadedAndParsedDataPromise = new Promise((resolve, reject) => {
    didLoadAndParse = resolve;
    failedToLoadAndParse = reject;
  });

  const thisPage = this;

  this.reset();

  const originalContainer = rootElement.parentNode || document.body;
  const rootContainerElement = document.createElement("div");
  rootContainerElement.appendChild(rootElement);

  const tagsWithText = "h1, h2, h3, h4, h5, h6, article, p";
  const elements = rootContainerElement.querySelectorAll(tagsWithText);

  // Mark up each word first...
  elements.forEach(function(element) {
    let texts = element.innerText.trim().split(WebWords.splitRegex);
    texts = texts.filter(function(text) {
      return text !== "";
    });
    let wrappedElements = texts.map(thisPage.wrapWord, thisPage);
    Page.replaceContents(element, wrappedElements);
    thisPage.pageElements.push(element);
  });
  originalContainer.appendChild(rootElement);

  // ...then go back and re-mark based on saved data.
  Fieldbook.getRecords(this.langCode)
    .then(thisPage.parseSavedData.bind(thisPage))
    .then(() => thisPage.infoBox = new InfoBox(thisPage))
    .then(didLoadAndParse)
    .catch(failedToLoadAndParse);
};

Page.prototype.waitForSavedData = function() {
  return this._loadedAndParsedDataPromise;
};

Page.prototype.wrapWord = function(text) {
  let element;

  if (text.match(WebWords.splitRegex) || text.match(WebWords.ignoreRegex)) {
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
  const word = Word.create(element);
  const textKey = element.innerText.toLowerCase();

  const isNew = !this.words[textKey];
  const isKnown = (word.learningStatus === Word.KNOWN);

  this.totalWordCount += 1;
  if (isNew) this.uniqueWordCount += 1;
  if (isKnown) this.totalKnownWordCount += 1;
  if (isNew && isKnown) this.uniqueKnownWordCount += 1;

  this.words[textKey] = word;
  element.addEventListener("click", this.markAsKnown.bind(this, word));
};

Page.prototype.parseSavedData = function(records) {
  if (!records) return;

  const thisPage = this;

  records.forEach(function(record) {
    const wordOnPage = thisPage.words[record.word];
    if (!wordOnPage) return;

    wordOnPage.fieldbookId = record.id;

    if (wordOnPage.learningStatus !== Word.KNOWN && record.how_well_known === Word.KNOWN) {
      thisPage.uniqueKnownWordCount += 1;
      thisPage.totalKnownWordCount += wordOnPage.occurrences.length;
      wordOnPage.markAsKnown();
    }
  });
};

Page.replaceContents = function(containerElement, childElements) {
  containerElement.innerHTML = "";
  childElements.forEach(function(childElement) {
    containerElement.appendChild(childElement);
  });
};
