'use strict';

const Constants = function() {
};

Constants.punctRegex =    /[\/.,:;'"“”?!¿¡<>«»()[\]]+/g;
Constants.splitRegex = /([\s\/.,:;'"“”?!¿¡<>«»()[\]]+)/;
Constants.ignoreRegex = /\d+/;

module.exports = Constants;
