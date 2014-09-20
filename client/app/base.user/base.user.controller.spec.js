'use strict';

describe('Controller: BaseUserCtrl', function () {

  // load the controller's module
  beforeEach(module('postalyzerApp'));

  var BaseUserCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BaseUserCtrl = $controller('BaseUserCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
