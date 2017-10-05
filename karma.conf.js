'use strict';

const istanbul = require("browserify-istanbul");

module.exports = function(config) {
  config.set({
    basePath: "",
    color: true,
    logLevel: config.LOG_INFO,
    singleRun: true,

    frameworks: ["browserify", "jasmine-ajax", "jasmine"],
    browsers: ["ChromeHeadless"],

    files: [
      "spec/lib/jasmine-2.8.0/mock-ajax.js", // delete after jasmine-ajax PR #176
      "spec/SpecHelper.js",
      "spec/ConstantsSpec.js",
      "spec/FieldbookSpec.js",
      "spec/InfoBoxSpec.js",
      "spec/LanguageSpec.js",
      "spec/PageSpec.js",
      "spec/StatisticsSpec.js",
      "spec/WebWordsSpec.js",
      "spec/WordSpec.js",
    ],

    reporters: ["spec", "coverage"],

    preprocessors: {
      "src/*.js": ["browserify", "coverage"],
      "spec/*.js": ["browserify", "coverage"]
    },

    browserify: {
      debug: true,
      extensions: [".js"],
      transform: [
        istanbul({
          instrumenterConfig: {
            embedSource: true
          }
        })
      ]
    },

    coverageReporter: {
      dir: "spec/coverage/",
      reporters: [
        { type: "text-summary" },
        { type: "lcov" }
      ]
    },

    customLaunchers: {
      Chrome_travis_ci: {
        base: "Chrome",
        flags: ["--no-sandbox"]
      }
    },
  });

  if (process.env.TRAVIS) {
    config.browsers = ["Chrome_travis_ci"];
  }
}
