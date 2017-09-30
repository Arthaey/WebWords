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
    }
  });

  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-karma-coveralls");

  grunt.registerTask("default", ["test"]);

  grunt.registerTask("test", ["karma"]);
}
