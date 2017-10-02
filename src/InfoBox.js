'use strict';

const InfoBox = function(langCode) {
  this.langCode = langCode || Language.UNKNOWN;
  this.element = null;
  this.markUpPageButton = null;

  this.initializeUI();
};

InfoBox.prototype.initializeUI = function() {
  this.element = document.createElement("div");
  this.element.classList.add("webwords-infobox");
  document.body.appendChild(this.element);

  this._addSection(`identified ${this.langCode.toUpperCase()}`);

  if (this.langCode !== Language.UNKNOWN) {
    this.markUpPageButton = document.createElement("button");
    this.markUpPageButton.appendChild(document.createTextNode("Mark up words"));
    this.element.appendChild(this.markUpPageButton);
  }
};

InfoBox.prototype.addMarkUpPageHandler = function(handler) {
  if (!handler || !this.markUpPageButton) return;
  this.markUpPageButton.addEventListener("click", handler);
};

InfoBox.prototype.update = function(stats) {
  this._removeElements();

  this._addSection(`language: ${this.langCode.toUpperCase()}`);
  this._addSection(`${stats.totalWordCount} words, ${stats.uniqueWordCount} unique`);
  this._addSection(`${this.percentKnownUniqueWords(stats)}% words known`);
  this._addSection(`${this.percentKnownPageWords(stats)}% page known`);

  const percent = this.percentKnownPageWords(stats);
  if (percent >= 95) {
    this.element.classList.add("well-known");
  } else if (percent >= 85) {
    this.element.classList.add("known");
  } else if (percent >= 75) {
    this.element.classList.add("somewhat-known");
  } else {
    this.element.classList.add("unknown");
  }

  return Promise.resolve();
};

InfoBox.prototype.percentKnownUniqueWords = function(stats) {
  return InfoBox._formatPercent(stats.uniqueKnownWordCount, stats.uniqueWordCount);
};

InfoBox.prototype.percentKnownPageWords = function(stats) {
  return InfoBox._formatPercent(stats.totalKnownWordCount, stats.totalWordCount);
};

InfoBox._formatPercent = function(nominator, denominator) {
  return Math.round(nominator * 100.0 / denominator);
};

InfoBox.prototype._addSection = function(text) {
  const elem = document.createElement("p");
  elem.classList.add("webwords-ignore");
  elem.appendChild(document.createTextNode(text));
  this.element.appendChild(elem);
};

InfoBox.prototype._removeElements = function() {
  while (this.element.firstChild) {
    this.element.removeChild(this.element.firstChild);
  }
};

InfoBox.cssRules = [
  `.webwords-infobox {
      position: fixed;
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
