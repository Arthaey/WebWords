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

  if (this.langCode !== Language.UNKNOWN) {
    const buttonText = `${this.langCode.toUpperCase()}: mark up words`;
    this.markUpPageButton = document.createElement("button");
    this.markUpPageButton.appendChild(document.createTextNode(buttonText));
    this.element.appendChild(this.markUpPageButton);
  }
};

InfoBox.prototype.addMarkUpPageHandler = function(handler) {
  if (!handler || !this.markUpPageButton) return;
  this.markUpPageButton.addEventListener("click", handler);
};

InfoBox.prototype.update = function(stats) {
  this._removeElements();

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
      font-size: 14px;
      font-weight: normal;
      margin: 0px;
      padding: 0px;
  }`,
  `.webwords-infobox button {
      font-size: 14px;
      color: white;
      background: linear-gradient(to bottom, #1496fc, #1172c2);
      border: 1px solid #0c548f;
      border-radius: 0.8rem;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
  }`,
  `.webwords-infobox button:hover {
      background: linear-gradient(to top, #1496fc, #1172c2);
  }`,
  `.webwords-infobox button:focus {
      outline: none;
  }`
];
