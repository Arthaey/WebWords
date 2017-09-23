'use strict';

const InfoBox = function(page) {
  InfoBox.addStylesheet();

  this.element = document.createElement("div");
  this.element.classList.add("webwords-infobox");
  document.body.appendChild(this.element);

  this.update(page);
};

InfoBox.addStylesheet = function() {
  const id = "webwords-stylesheet";
  if (document.getElementById(id)) return;

  const styleElem = document.createElement("style");
  styleElem.id = id;
  document.head.appendChild(styleElem);

  const stylesheet = styleElem.sheet;

  InfoBox.addCssRule(stylesheet, `
    .webwords-infobox {
      position: absolute;
      top: 0px;
      right: 0px;
      margin: 10px;
      padding: 10px;
      border: 2px solid;
      border-radius: 10px;
      background-color: #ccc;
    }
  `);

  InfoBox.addCssRule(stylesheet, `
    .webwords-infobox p {
      margin: 0px;
      padding: 0px;
    }
  `);
};

InfoBox.addCssRule = function(stylesheet, rule) {
  stylesheet.insertRule(rule, stylesheet.cssRules.length);
};

InfoBox.prototype.update = function(page) {
  this.element.innerHTML = "";
  if (!page) return;

  const totalWordCount = page.words.length;
  const uniqueWordCount = Object.keys(page.uniqueWords).length;
  const knownWordCount = 0;
  const percent = knownWordCount / totalWordCount;

  const langAndPercentKnown = document.createElement("p");
  langAndPercentKnown.innerHTML = `${page.langCode.toUpperCase()}: ${percent}% known`;

  const wordCount = document.createElement("p");
  wordCount.innerHTML = `${totalWordCount} words, ${uniqueWordCount} unique`;

  this.element.appendChild(langAndPercentKnown);
  this.element.appendChild(wordCount);
};
