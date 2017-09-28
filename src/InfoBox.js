'use strict';

const InfoBox = function(page) {
  this.langCode = page ? page.langCode : Language.UNKNOWN;
  this.element = document.createElement("div");

  this.element.classList.add("webwords-infobox");
  document.body.appendChild(this.element);

  this.setStatisticsFromPage(page);
  this.update();
};

InfoBox.prototype.setStatisticsFromPage = function(page) {
  this.totalWordCount = page.totalWordCount;
  this.uniqueWordCount = page.uniqueWordCount;
  this.totalKnownWordCount = page.totalKnownWordCount;
  this.uniqueKnownWordCount = page.uniqueKnownWordCount;
};

InfoBox.prototype.update = function() {
  this.element.innerHTML = "";

  const langCodeEl = document.createElement("p");
  langCodeEl.innerHTML = `language: ${this.langCode.toUpperCase()}`;
  this.element.appendChild(langCodeEl);

  const wordCountEl = document.createElement("p");
  wordCountEl.innerHTML = `${this.totalWordCount} words, ${this.uniqueWordCount} unique`;
  this.element.appendChild(wordCountEl);

  const percentWordsKnownEl = document.createElement("p");
  percentWordsKnownEl.innerHTML = `${this.percentKnownUniqueWords()}% words known`;
  this.element.appendChild(percentWordsKnownEl);

  const percentPageKnownEl = document.createElement("p");
  percentPageKnownEl.innerHTML = `${this.percentKnownPageWords()}% page known`;
  this.element.appendChild(percentPageKnownEl);

  const percent = this.percentKnownPageWords();
  if (percent >= 95) {
    this.element.classList.add("well-known");
  } else if (percent >= 85) {
    this.element.classList.add("known");
  } else if (percent >= 75) {
    this.element.classList.add("somewhat-known");
  } else {
    this.element.classList.add("unknown");
  }
};

InfoBox.prototype.addKnownWord = function(word) {
  this.uniqueKnownWordCount += 1;
  this.totalKnownWordCount += word.occurrences.length;
  this.update();
};

InfoBox.prototype.percentKnownUniqueWords = function() {
  return InfoBox._formatPercent(this.uniqueKnownWordCount, this.uniqueWordCount);
};

InfoBox.prototype.percentKnownPageWords = function() {
  return InfoBox._formatPercent(this.totalKnownWordCount, this.totalWordCount);
};

InfoBox._formatPercent = function(nominator, denominator) {
  return Math.round(nominator * 100.0 / denominator);
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
