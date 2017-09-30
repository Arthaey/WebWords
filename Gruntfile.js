module.exports = function(grunt) {
  var sourceFiles = "src/*.js";
  var mainFile = "dist/src.js";

  grunt.initConfig({
    "pkg": grunt.file.readJSON("package.json"),

    "karma": {
      "unit": {
        "configFile": "karma.conf.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-karma");

  grunt.registerTask("default", ["test"]);

  grunt.registerTask("test", ["karma"]);
}
