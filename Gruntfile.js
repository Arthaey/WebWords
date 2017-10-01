module.exports = function(grunt) {
  var sourceFiles = "src/*.js";
  var mainFile = "dist/src.js";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    karma: {
      unit: {
        configFile: "karma.conf.js"
      }
    },

    coveralls: {
      options: {
        debug: true,
        coverageDir: "spec/coverage",
        force: true,
        recursive: true
      }
    },

    concat: {
      dist: {
        src: [
          "src/Fieldbook.js",
          "src/Language.js",
          "src/WebWords.js",
          "src/Word.js",
          "src/Page.js",
          "src/InfoBox.js"
        ],
        dest: "dist/src.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-karma-coveralls");

  grunt.registerTask("default", ["test"]);

  grunt.registerTask("build", ["concat"]);
  grunt.registerTask("test", ["karma"]);
}
