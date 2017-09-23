'use strict';

const Page = function(langCode, rootElement) {
  this.resetWords();
  this.langCode = langCode || null;

  this.loadedPromise = this.parseWords(rootElement);
};

Page.prototype.resetWords = function() {
  this.words = []; // hash of string => array of Word
  this.totalWordCount = 0;
  this.uniqueWordCount = 0;
  this.knownWordCount = 0;
  this.elements = [];
};

Page.prototype.parseWords = function(rootElement) {
  if (!rootElement) {
    return Promise.resolve(this);
  }

  this.resetWords();

  const rootContainerElement = document.createElement("div");
  rootContainerElement.appendChild(rootElement);

  const tagsWithText = "h1, h2, h3, h4, h5, h6, article, p";
  const elements = rootContainerElement.querySelectorAll(tagsWithText);

  const thisPage = this;
  elements.forEach(function(element) {
    let texts = element.innerText.trim().split(WebWords.splitRegex);
    texts = texts.filter(function(text) {
      return text !== "";
    });
    let wrappedElements = texts.map(thisPage.wrapWord, thisPage);
    Page.replaceContents(element, wrappedElements);
    thisPage.elements.push(element);
  });

  return Promise.resolve(this);
};

Page.prototype.wrapWord = function(text) {
  let element;

  if (text.match(WebWords.splitRegex)) {
    // punctuation, spaces, etc
    element = document.createTextNode(text);
  } else {
    element = document.createElement("span");
    element.classList.add("L1");
    element.classList.add("unknown");
    element.innerHTML = text;

    const textKey = text.toLowerCase();
    this.totalWordCount += 1;

    if (!this.words[textKey]) {
      this.uniqueWordCount += 1;
      this.words[textKey] = [];
    }

    this.words[textKey].push(new Word(element));
  }

  return element;
};

Page.prototype.loaded = function() {
  return this.loadedPromise;
};

Page.replaceContents = function(containerElement, childElements) {
  containerElement.innerHTML = "";
  childElements.forEach(function(childElement) {
    containerElement.appendChild(childElement);
  });
};
