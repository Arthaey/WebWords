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

  const percentPageKnown = document.createElement("p");
  percentPageKnown.innerHTML = `${page.percentKnownPageWords()}% page known`;
  this.element.appendChild(percentPageKnown);
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
  }`,
  `.webwords-infobox p {
      margin: 0px;
      padding: 0px;
  }`,
];
