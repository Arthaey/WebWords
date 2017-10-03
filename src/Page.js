'use strict';

const Page = function(langCode, rootElement) {
  this.langCode = langCode || Language.UNKNOWN;
  this.reset();
  this.parseWords(rootElement);
};

Page.prototype.reset = function() {
  this.destroy();

  this.pageElements = [];
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

  this.stats.totalKnownWordCount += word.occurrences.length;
  this.stats.uniqueKnownWordCount += 1;
  this.infoBox.update(this.stats);

  return Fieldbook.createRecord(this.langCode, word);
};

Page.prototype.parseWords = function(rootElement) {
  if (!rootElement || this.langCode === Language.UNKNOWN) return;

  const thisPage = this;

  this.reset();

  const originalContainer = rootElement.parentNode;
  const rootContainerElement = document.createElement("div");
  rootContainerElement.appendChild(rootElement);

  const tagsWithText = "h1, h2, h3, h4, h5, h6, article, p:not(.webwords-ignore)";
  const elements = rootContainerElement.querySelectorAll(tagsWithText);

  elements.forEach(function(element) {
    let texts = element.innerText.trim().split(Constants.splitRegex);
    texts = texts.filter(function(text) {
      return text !== "";
    });
    let wrappedElements = texts.map(thisPage.wrapWord, thisPage);
    Page.replaceContents(element, wrappedElements);
    thisPage.pageElements.push(element);
  });
  originalContainer.appendChild(rootElement);
};

Page.prototype.getSavedWords = function() {
  const thisPage = this;
  const thisInfoBox = this.infoBox;

  return Fieldbook.getRecords(this.langCode)
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
  const word = Word.create(element);
  const isNew = !this.words[word.text];
  const isKnown = (word.learningStatus === Word.KNOWN);

  this.stats.totalWordCount += 1;
  if (isNew) this.stats.uniqueWordCount += 1;
  if (isKnown) this.stats.totalKnownWordCount += 1;
  if (isNew && isKnown) this.stats.uniqueKnownWordCount += 1;

  this.words[word.text] = word;
  element.addEventListener("click", this.markAsKnown.bind(this, word));
};

Page.prototype.parseSavedData = function(records) {
  const thisPage = this;

  records.forEach(function(record) {
    const wordOnPage = thisPage.words[record.word];
    if (!wordOnPage) return;

    wordOnPage.fieldbookId = record.id;

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

Page.replaceContents = function(containerElement, childElements) {
  containerElement.innerHTML = "";
  childElements.forEach(function(childElement) {
    containerElement.appendChild(childElement);
  });
};
