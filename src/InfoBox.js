'use strict';

const Language = require("./Language.js");

const InfoBox = function(langCode) {
  this.langCode = langCode || Language.UNKNOWN;
  this.element = null;
  this.markUpPageButton = null;

  this.initializeUI();
};

InfoBox.prototype.initializeUI = function() {
  this.element = document.createElement("div");
  this.element.classList.add(InfoBox.className);
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

  const hue = InfoBox._hue(stats.percentKnownPageWords());
  this.element.style.backgroundColor = `hsl(${hue}, 100%, 95%)`;
  this.element.style.borderColor = `hsl(${hue}, 100%, 25%)`;

  return Promise.resolve();
};

InfoBox.prototype.destroy = function() {
  if (this.element) {
    this._removeElements();
    this.element.parentNode.removeChild(this.element);
    this.element = null;
  }
};

InfoBox._hue = function(percentInt) {
  const percent = percentInt / 100.0;
  const skewedPercent = (percent < .75) ? percent/2 : percent;
  const greenHue = 125;
  return Math.round(greenHue * skewedPercent);
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

InfoBox.className = "webwords-infobox";

InfoBox.cssRules = [
  `.${InfoBox.className} {
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
  `.${InfoBox.className} p {
      font-size: 14px;
      font-weight: normal;
      margin: 0px;
      padding: 0px;
  }`,
  `.${InfoBox.className} button {
      font-size: 14px;
      color: white;
      background: linear-gradient(to bottom, #1496fc, #1172c2);
      border: 1px solid #0c548f;
      border-radius: 0.8rem;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
  }`,
  `.${InfoBox.className} button:hover {
      background: linear-gradient(to top, #1496fc, #1172c2);
  }`,
  `.${InfoBox.className} button:focus {
      outline: none;
  }`
];

module.exports = InfoBox;
