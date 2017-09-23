'use strict';

const InfoBox = function(page) {
  InfoBox.addStylesheet();

  this.element = document.createElement("div");
  this.element.classList.add("webwords-infobox");
  document.body.appendChild(this.element);

  this.update(page);
};

InfoBox.prototype.update = function(page) {
  this.element.innerHTML = "";
  if (!page) return;

  const totalWordCount = page.totalWordCount;
  const uniqueWordCount = page.uniqueWordCount;
  const knownWordCount = page.knownWordCount;
  const percentWords = knownWordCount / totalWordCount; // TODO
  const percentPage = knownWordCount / totalWordCount; // TODO

  const langCode = document.createElement("p");
  langCode.innerHTML = `language: ${page.langCode.toUpperCase()}`;
  this.element.appendChild(langCode);

  const percentWordsKnown = document.createElement("p");
  percentWordsKnown.innerHTML = `${percentWords}% words known`;
  this.element.appendChild(percentWordsKnown);

  const percentPageKnown = document.createElement("p");
  percentPageKnown.innerHTML = `${percentPage}% page known`;
  this.element.appendChild(percentPageKnown);

  const wordCount = document.createElement("p");
  wordCount.innerHTML = `${totalWordCount} words, ${uniqueWordCount} unique`;
  this.element.appendChild(wordCount);
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
