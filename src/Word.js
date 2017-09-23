'use strict';

const Word = function(parentElement, learningStatus = "unknown") {
  const lowercase = parentElement.innerText.trim().toLowerCase()
  this.text = lowercase.replace(WebWords.punctRegex, "");
  this.learningStatus = learningStatus;

  parentElement.addEventListener("click", this.markAsKnown.bind(this));
};

Word.prototype.markAsKnown = function() {
  this.learningStatus = "known";
};
