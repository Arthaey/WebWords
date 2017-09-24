'use strict';

const Page = function(langCode, rootElement) {
  this.resetWords();
  this.langCode = langCode || null;
  this.loadedPromise = null;

  this.parseWords(rootElement);
};

Page.prototype.resetWords = function() {
  this.pageElements = [];
  this.words = [];

  this.totalWordCount = 0;
  this.uniqueWordCount = 0;
  this.totalKnownWordCount = 0;
  this.uniqueKnownWordCount = 0;
};

Page.prototype.percentKnownUniqueWords = function() {
  return Math.round(this.uniqueKnownWordCount * 100.0 / this.uniqueWordCount);
};

Page.prototype.percentKnownPageWords = function() {
  return Math.round(this.totalKnownWordCount * 100.0 / this.totalWordCount);
};

Page.prototype.parseWords = function(rootElement) {
  if (!rootElement) {
    this.loadedPromise = Promise.resolve(this);
    return this.loadedPromise;
  }

  const thisPage = this;

  this.resetWords();

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

  // ...then go back and re-mark based on saved data.
  this.loadSavedData()
    .then(thisPage.parseSavedData.bind(thisPage))
    .then(function() {
      thisPage.loadedPromise = Promise.resolve(this);
    });

  return this.loadedPromise;
};

Page.prototype.wrapWord = function(text) {
  let element;

  if (text.match(WebWords.splitRegex)) {
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
  const isKnown = (word.learningStatus == Word.KNOWN);

  this.totalWordCount += 1;
  if (isNew) this.uniqueWordCount += 1;
  if (isKnown) this.totalKnownWordCount += 1;
  if (isNew && isKnown) this.uniqueKnownWordCount += 1;

  this.words[textKey] = word;
};

Page.prototype.loaded = function() {
  return this.loadedPromise;
};

Page.prototype.loadSavedData = function() {
  const fieldbookAuth = btoa(`${WebWords.fieldbookKey}:${WebWords.fieldbookSecret}`);
  const fieldbookSheetUrl = WebWords.fieldbookUrl + this.langCode;

  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", fieldbookSheetUrl);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", "Basic " + fieldbookAuth);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = (progressEvent) => reject(progressEvent, xhr.statusText);
    xhr.send();
  })
  .catch(function(progressEvent, statusText) {
    console.error(`ERROR connecting to ${fieldbookSheetUrl}: '${statusText}'`);
    console.error(progressEvent);
  });

  this.loadedPromise = promise;
  return this.loadedPromise;
}

Page.prototype.parseSavedData = function(savedData) {
  if (!savedData) return;

  const thisPage = this;
  const records = JSON.parse(savedData);

  records.forEach(function(record) {
    const wordOnPage = thisPage.words[record.word];
    if (!wordOnPage) return;
    if (wordOnPage.learningStatus != Word.KNOWN && record.how_well_known == Word.KNOWN) {
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
