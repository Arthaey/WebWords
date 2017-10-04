module.exports = function(config) {
  config.set({
    frameworks: ["browserify", "jasmine-ajax", "jasmine"],
    browsers: ["ChromeHeadless"],
    singleRun: true,

    files: [
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
      "src/*.js": ["coverage"],
      "spec/*.js": ["browserify"]
    },

    browserify: {
      debug: true
    },

    coverageReporter: {
      type: "lcov",
      dir: "spec/coverage/",
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
