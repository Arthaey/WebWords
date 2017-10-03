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
          "src/Constants.js",
          "src/Fieldbook.js",
          "src/Language.js",
          "src/Statistics.js",
          "src/WebWords.js",
          "src/Word.js",
          "src/Page.js",
          "src/InfoBox.js"
        ],
        dest: mainFile
      }
    },

    scp: {
      options: {
        host: "arthaey.com",
        username: grunt.option("release-username"),
        password: grunt.option("release-password"),
      },
      dist: {
        files: [{
          src: "src.js",
          cwd: "dist",
          dest: "www/arthaey.com/live/tech/programming/webwords",
        }]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-karma-coveralls");
  grunt.loadNpmTasks("@kyleramirez/grunt-scp");

  grunt.registerTask("default", ["test", "build"]);

  grunt.registerTask("build", ["concat"]);
  grunt.registerTask("test", ["karma"]);
  grunt.registerTask("release", ["build", "scp"]);
}
