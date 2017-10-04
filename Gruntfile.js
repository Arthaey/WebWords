module.exports = function(grunt) {
  'use strict';

  var srcFiles = "src/*.js";
  var specFiles = "spec/*.js";
  var mainFile = "dist/src.js";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    browserify: {
      dist: {
        files: {
          "dist/src.js": [srcFiles]
        },
        options: {
          browserifyOptions: {
            debug: true
          }
        }
      },
      test: {
        files: {
          "spec/SpecBundle.js": [
            "spec/SpecHelper.js",
            "spec/ConstantsSpec.js",
            "spec/FieldbookSpec.js",
            "spec/InfoBoxSpec.js",
            "spec/LanguageSpec.js",
            "spec/PageSpec.js",
            "spec/StatisticsSpec.js",
            "spec/WebWordsSpec.js",
            "spec/WordSpec.js",
          ]
        },
        options: {
          browserifyOptions: {
            debug: true
          }
        }
      }
    },

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

    eslint: {
      target: [
        srcFiles,
        specFiles,
        "!spec/SpecBundle.js"
      ]
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

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-karma-coveralls");
  grunt.loadNpmTasks("@kyleramirez/grunt-scp");

  grunt.registerTask("default", ["test", "build"]);

  grunt.registerTask("build", ["browserify"]);
  grunt.registerTask("test", ["eslint", "karma"]);
  grunt.registerTask("release", ["build", "scp"]);
}
