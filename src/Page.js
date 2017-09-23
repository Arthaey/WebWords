'use strict';

const Page = function(rootElement) {
  this.reset();
  this.parseWords(rootElement);
};

Page.prototype.reset = function() {
  this.words = [];
  this.uniqueWords = [];
  this.elements = [];
};

Page.prototype.parseWords = function(rootElement) {
  if (!rootElement) return;

  this.reset();

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
};

Page.prototype.wrapWord = function(text) {
  let element;

  if (text.match(WebWords.splitRegex)) {
    element = document.createTextNode(text);
  } else {
    element = document.createElement("span");
    element.classList.add("L1");
    element.classList.add("unknown");
    element.innerHTML = text;

    const word = new Word(element);
    this.words.push(word);

    if (!this.uniqueWords[word.text]) {
      this.uniqueWords[word.text] = 0;
    }
    this.uniqueWords[word.text] += 1;
  }

  return element;
};

Page.replaceContents = function(containerElement, childElements) {
  containerElement.innerHTML = "";
  childElements.forEach(function(childElement) {
    containerElement.appendChild(childElement);
  });
};

/*
Page.getTextNodes = function(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(element ,NodeFilter.SHOW_TEXT, null, false);

  let textNode = null;
  while (textNode = walker.next()) {
    textNodes.push(textNode);
  }

  return textNodes;
};
*/
