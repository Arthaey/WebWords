'use strict';

const Statistics = function(initialValues = {}) {
  this.totalWordCount = initialValues.totalWordCount || 0;
  this.uniqueWordCount = initialValues.uniqueWordCount || 0;
  this.totalKnownWordCount = initialValues.totalKnownWordCount || 0;
  this.uniqueKnownWordCount = initialValues.uniqueKnownWordCount || 0;
};

Statistics.fromPage = function(page) {
  const stats = new Statistics();
  stats.totalWordCount = page.stats.totalWordCount;
  stats.uniqueWordCount = page.stats.uniqueWordCount;
  stats.totalKnownWordCount = page.stats.totalKnownWordCount;
  stats.uniqueKnownWordCount = page.stats.uniqueKnownWordCount;
  return stats;
};
