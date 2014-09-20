'use strict';

describe('Controller: BaseFeedCtrl', function () {

  // load the controller's module
  beforeEach(module('postalyzerApp'));

  var BaseFeedCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BaseFeedCtrl = $controller('BaseFeedCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
