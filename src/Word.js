'use strict';

const Word = function(textOrElement, learningStatus = "unknown") {
  let text = textOrElement;
  if ("string" !== typeof textOrElement) {
    text = textOrElement.innerText;
    textOrElement.addEventListener("click", this.markAsKnown.bind(this));
  }

  this.text = text.trim().toLowerCase().replace(WebWords.punctRegex, "");
  this.learningStatus = learningStatus;
};

Word.prototype.markAsKnown = function() {
  this.learningStatus = "known";
};
