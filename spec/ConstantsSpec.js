'use strict';

describe("Language", function() {
  it("constructor does nothing", function() {
    const constants = new Constants();
    expect(constants).not.toBeUndefined();
    expect(constants).not.toBeNull();
  });
});
