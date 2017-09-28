'use strict';

const InfoBox = function(page) {
  this.element = document.createElement("div");
  this.element.classList.add("webwords-infobox");
  document.body.appendChild(this.element);

  this.update(page);
};

InfoBox.prototype.update = function(page) {
  this.element.innerHTML = "";
  if (!page) return;

  if (page.langCode) {
    const langCode = document.createElement("p");
    langCode.innerHTML = `language: ${page.langCode.toUpperCase()}`;
    this.element.appendChild(langCode);
  }

  const wordCount = document.createElement("p");
  wordCount.innerHTML = `${page.totalWordCount} words, ${page.uniqueWordCount} unique`;
  this.element.appendChild(wordCount);

  const percentWordsKnown = document.createElement("p");
  percentWordsKnown.innerHTML = `${page.percentKnownUniqueWords()}% words known`;
  this.element.appendChild(percentWordsKnown);

  const knownPageWords = page.percentKnownPageWords();
  const percentPageKnown = document.createElement("p");
  percentPageKnown.innerHTML = `${knownPageWords}% page known`;
  this.element.appendChild(percentPageKnown);

  if (knownPageWords >= 95) {
    this.element.classList.add("well-known");
  } else if (knownPageWords >= 85) {
    this.element.classList.add("known");
  } else if (knownPageWords >= 75) {
    this.element.classList.add("somewhat-known");
  } else {
    this.element.classList.add("unknown");
  }
};

InfoBox.cssRules = [
  `.webwords-infobox {
      position: absolute;
      top: 0px;
      right: 0px;
      margin: 10px;
      padding: 10px;
      border: 2px solid;
      border-radius: 10px;
      background-color: #ccc;
      font-weight: bold;
      z-index: 100;
  }`,
  `.webwords-infobox.well-known {
      background-color: #a9bcaa;
  }`,
  `.webwords-infobox.known {
      background-color: #f7eb81;
  }`,
  `.webwords-infobox.somewhat-known {
      background-color: #f7c481;
  }`,
  `.webwords-infobox.unknown {
      background-color: #ebb1b1;
  }`,
  `.webwords-infobox p {
      margin: 0px;
      padding: 0px;
  }`,
];
