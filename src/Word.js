'use strict';

const Word = function(parentElement, learningStatus = "unknown") {
  this.parentElement = parentElement;
  this.text = parentElement.innerText;
  this.learningStatus = learningStatus;

  this.parentElement.addEventListener("click", this.markAsKnown.bind(this));
};

Word.prototype.markAsKnown = function() {
  this.learningStatus = "known";
};
