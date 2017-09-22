'use strict';

const Page = function(rootElement) {
  this.words = [];
  this.uniqueWords = [];

  this.parse(rootElement);
};

Page.prototype.parse = function(rootElement) {
  if (!rootElement) return;
  const elements = rootElement.querySelectorAll("p");

  this.words = [];
  this.uniqueWords = [];

  for (let i = 0; i < elements.length; i++) {
    let word = elements[i].innerText;
    this.words.push(new Word(elements[i]));
    if (!this.uniqueWords[word]) {
      this.uniqueWords[word] = 0;
    }
    this.uniqueWords[word] += 1;
  }
};
