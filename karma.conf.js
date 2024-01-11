// Karma configuration
// Generated on Sun Oct 22 2023 16:14:56 GMT-0400 (Eastern Daylight Time)

const webpackConfig = require('./webpack.dev.js');

module.exports = function(config) {
  config.set({

    plugins: ['karma-firefox-launcher', 'karma-jasmine', 'karma-webpack', 'karma-jasmine-html-reporter'],

    webpack: webpackConfig,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: 'test/**/*spec.js' }
    ],


    // list of files / patterns to exclude
    exclude: [
      //'test/Cluml/Components/Class.spec.js'
    ],
    //'test/Cluml/Diagrams.spec.js'

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      'test/**/*.spec.js': ['webpack'],
    },

    //'node_modules/dialog-cl/src/_dialog.scss': ['webpack']
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity
  })
}
