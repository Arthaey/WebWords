module.exports = function(grunt) {
  'use strict';

  const srcFiles = ["src/*.js"];

  const specFiles = [
    "spec/SpecHelper.js",
    "spec/*Spec.js",
    "!spec/SpecBundle.js"
  ];

  const packageJson = grunt.file.readJSON("package.json");

  const browserifyOpts = {
    browserifyOptions: {
      debug: true,
      paths: ["."]
    }
  };

  grunt.initConfig({
    pkg: packageJson,

    browserify: {
      dist: {
        options: browserifyOpts,
        files: {
          "dist/src.js": srcFiles
        }
      },
      test: {
        options: browserifyOpts,
        files: {
          "spec/SpecBundle.js": specFiles
        }
      }
    },

    clean: [
      "dist/",
      "spec/coverage/",
      "spec/SpecBundle.js"
    ],

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
      target: srcFiles.concat(specFiles)
    },

    nsp: {
      package: packageJson
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
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-karma-coveralls");
  grunt.loadNpmTasks("grunt-nsp");
  grunt.loadNpmTasks("@kyleramirez/grunt-scp");

  grunt.registerTask("default", ["test", "build"]);

  grunt.registerTask("build", ["browserify"]);
  grunt.registerTask("build:test", ["browserify:test"]);
  grunt.registerTask("test", ["eslint", "nsp", "browserify:test", "karma"]);
  grunt.registerTask("release", ["build", "scp"]);
}
