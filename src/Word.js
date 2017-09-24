'use strict';

const Word = function(textOrElement, learningStatus) {
  this.text = Word.normalizeText(textOrElement);
  this.learningStatus = learningStatus || Word.UNKNOWN;
  this.occurrences = [];

  if (!Word.isString(textOrElement)) {
    this.addOccurrence(textOrElement);
  }
};

Word.KNOWN = "known";
Word.UNKNOWN = "unknown";

Word.prototype.markAsKnown = function() {
  this.learningStatus = Word.KNOWN;
  this.updateCssClasses();
};

Word.prototype.addOccurrence = function(element) {
  element.addEventListener("click", this.markAsKnown.bind(this));
  this.occurrences.push(element);
  this.updateCssClasses();
};

Word.prototype.updateCssClasses = function() {
  const otherStatus = (this.learningStatus == Word.KNOWN) ? Word.UNKNOWN : Word.KNOWN;

  const thisWord = this;
  this.occurrences.forEach(function(element) {
    element.classList.add("L2");
    element.classList.add(thisWord.learningStatus);
    element.classList.remove(otherStatus);
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
    word = new Word(text, learningStatus || Word.UNKNOWN);
  }

  if (learningStatus) {
    const previousStatus = word.learningStatus;
    word.learningStatus = learningStatus;
    if (learningStatus != previousStatus) {
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
  return text.trim().toLowerCase().replace(WebWords.punctRegex, "");
};

Word.isString = function(textOrElement) {
  return "string" === typeof textOrElement;
};
