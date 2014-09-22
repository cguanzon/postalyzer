'use strict';

describe('Service: igService', function () {

  // load the service's module
  beforeEach(module('postalyzerApp'));

  // instantiate service
  var igService;
  beforeEach(inject(function (_igService_) {
    igService = _igService_;
  }));

  it('should do something', function () {
    expect(!!igService).toBe(true);
  });

});
