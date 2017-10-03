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

  this.element.appendChild(InfoBox._createFieldset(
    "Total", "page",
    stats.totalKnownWordCount,
    stats.totalWordCount,
    stats.percentKnownPageWords()
  ));

  this.element.appendChild(InfoBox._createFieldset(
    "Unique", "words",
    stats.uniqueKnownWordCount,
    stats.uniqueWordCount,
    stats.percentKnownUniqueWords()
  ));

  this.element.className = "webwords-infobox";
  const percent = stats.percentKnownPageWords();
  if (percent >= 90) {
    this.element.classList.add("well-known");
  } else if (percent >= 75) {
    this.element.classList.add("known");
  } else if (percent >= 50) {
    this.element.classList.add("somewhat-known");
  } else {
    this.element.classList.add("unknown");
  }

  return Promise.resolve();
};

InfoBox._createFieldset = function(type, percentType, known, all, percent) {
  const fieldset = document.createElement("fieldset");
  fieldset.innerHTML = `
    <legend>
      ${type} Words
    </legend>
    <p>
      ${known.toLocaleString()} known
      /
      ${all.toLocaleString()} ${type.toLowerCase()}
    </p>
    <p>
      ${percent}% ${percentType} known
    </p>
  `;
  return fieldset;
}

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
  }`
];
