'use strict';

const Page = require("../src/Page.js");
const Statistics = require("../src/Statistics.js");

describe("Statistics", function() {
  it("defaults to all zeros", function() {
    const stats = new Statistics();
    expect(stats.totalWordCount).toBe(0);
    expect(stats.uniqueWordCount).toBe(0);
    expect(stats.totalKnownWordCount).toBe(0);
    expect(stats.uniqueKnownWordCount).toBe(0);
  });

  it("sets initial values based on params", function() {
    const stats = new Statistics({ totalWordCount: 42 });
    expect(stats.totalWordCount).toBe(42);
    expect(stats.uniqueWordCount).toBe(0);
    expect(stats.totalKnownWordCount).toBe(0);
    expect(stats.uniqueKnownWordCount).toBe(0);
  });

  it("sets values directly", function() {
    const stats = new Statistics();
    stats.totalWordCount += 1;
    expect(stats.totalWordCount).toBe(1);
  });

  it("sets values based on a page's Statistics", function() {
    const page = new Page();
    page.stats = new Statistics({ totalWordCount: 42 });
    const stats = Statistics.fromPage(page);
    expect(stats.totalWordCount).toBe(42);
    page.destroy();
  });
});
