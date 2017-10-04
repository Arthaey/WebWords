'use strict';

const Constants = require("../src/Constants.js");

describe("Constants", function() {
  it("constructor does nothing", function() {
    const constants = new Constants();
    expect(constants).not.toBeUndefined();
    expect(constants).not.toBeNull();
  });
});
