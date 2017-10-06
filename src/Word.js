'use strict';

const Constants = require("src/Constants.js");

const Word = function(textOrElement, learningStatus) {
  this.text = Word.normalizeText(textOrElement);
  this.learningStatus = learningStatus || Word.UNVERIFIED;
  this.dataStoreId = null;

  // These two arrays stay in sync, so occurences[i] goes with clickHandlers[i].
  this.occurrences = [];
  this.clickHandlers = [];

  if (!Word.isString(textOrElement)) {
    this.addOccurrence(textOrElement);
  }
};

Word.KNOWN = "known";
Word.UNKNOWN = "unknown";
Word.UNVERIFIED = "unverified";
Word.LEARNING_STATUSES = [Word.KNOWN, Word.UNKNOWN, Word.UNVERIFIED];

Word.prototype.markAsKnown = function() {
  this.learningStatus = Word.KNOWN;
  this.updateCssClasses();
};

Word.prototype.markAsUnknown = function() {
  this.learningStatus = Word.UNKNOWN;
  this.updateCssClasses();
};

Word.prototype.addOccurrence = function(element) {
  this.occurrences.push(element);
  this.clickHandlers.push(null);
  this.updateCssClasses();
};

Word.prototype.addClickHandler = function(element, handler) {
  for (let i = 0; i < this.occurrences.length; i++) {
    const occurrence = this.occurrences[i];
    if (occurrence === element) {
      occurrence.addEventListener("click", handler);
      this.clickHandlers[i] = handler;
    }
  }
};

Word.prototype.removeClickHandlers = function() {
  const thisWord = this;
  this.clickHandlers.forEach(function(handler, ndx) {
    if (handler) {
      thisWord.occurrences[ndx].removeEventListener("click", handler);
      thisWord.clickHandlers[ndx] = null;
    }
  });
};

Word.prototype.updateCssClasses = function() {
  const thisWord = this;
  const otherStatuses = Word.LEARNING_STATUSES.filter(function(status) {
    return status !== thisWord.learningStatus;
  });

  this.occurrences.forEach(function(element) {
    element.classList.add("L2");
    element.classList.add(thisWord.learningStatus);
    otherStatuses.forEach(function(otherStatus) {
      element.classList.remove(otherStatus);
    });
  });
};

Word.allWordsByText = {};

Word.forgetAll = function() {
  Word.allWordsByText = {};
};

Word.create = function(textOrElement, learningStatus) {
  const text = Word.normalizeText(textOrElement);
  let word = Word.allWordsByText[text];

  if (!word) {
    word = new Word(text, learningStatus || Word.UNVERIFIED);
  }

  if (learningStatus) {
    const previousStatus = word.learningStatus;
    word.learningStatus = learningStatus;
    if (learningStatus !== previousStatus) {
      word.updateCssClasses();
    }
  }

  Word.allWordsByText[text] = word;

  if (!Word.isString(textOrElement)) {
    word.addOccurrence(textOrElement);
  }

  return word;
};

Word.normalizeText = function(textOrElement) {
  const text = Word.isString(textOrElement) ? textOrElement : textOrElement.innerText;
  return text.trim().toLowerCase().replace(Constants.punctRegex, "");
};

Word.isString = function(textOrElement) {
  return "string" === typeof textOrElement;
};

Word.cssRules = [
  `.L2.unknown {
      border-radius: 2px;
      background-color: yellow;
  }`,
  `a .L2.unknown {
      border-bottom: 1px solid blue;
  }`,
  `.L2.known:hover {
      border-bottom: 2px solid green;
  }`
];

module.exports = Word;
