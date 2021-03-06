module.exports = function(grunt) {
  'use strict';

  const packageJson = grunt.file.readJSON("package.json");

  const srcFiles = ["src/*.js"];

  const specFiles = [
    "spec/SpecHelper.js",
    "spec/*Spec.js",
    "!spec/SpecBundle.js"
  ];

  const allFiles = srcFiles.concat(specFiles);

  const browserifyOpts = {
    browserifyOptions: {
      debug: true,
      watch: true,
      paths: ["."]
    }
  };

  const scpOpts = {
    host: "arthaey.com",
    username: grunt.option("release-username") || process.env["USER"]
  };

  const sshKeyPath = process.env["HOME"] + "/.ssh/id_dsa";
  if (grunt.file.exists(sshKeyPath)) {
    scpOpts["privateKey"] = grunt.file.read(sshKeyPath);
  } else {
    scpOpts["password"] = grunt.option("release-password");
  }

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
      target: allFiles
    },

    nsp: {
      package: packageJson
    },

    scp: {
      options: scpOpts,
      dist: {
        files: [{
          src: "src.js",
          cwd: "dist",
          dest: "www/arthaey.com/live/tech/programming/webwords",
        }]
      }
    },

    watch: {
      files: allFiles,
      tasks: ["build"]
    }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-karma-coveralls");
  grunt.loadNpmTasks("grunt-nsp");
  grunt.loadNpmTasks("@kyleramirez/grunt-scp");

  grunt.registerTask("default", ["test", "build"]);

  grunt.registerTask("build", ["browserify"]);
  grunt.registerTask("build:test", ["browserify:test"]);
  grunt.registerTask("dev", ["build", "watch"]);
  grunt.registerTask("test", ["eslint", "build:test", "karma"]);
  grunt.registerTask("release", ["clean", "build", "nsp", "scp"]);
}
