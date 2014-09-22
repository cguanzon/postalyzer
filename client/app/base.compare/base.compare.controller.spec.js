'use strict';

describe('Controller: BaseCompareCtrl', function () {

  // load the controller's module
  beforeEach(module('postalyzerApp'));

  var BaseCompareCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BaseCompareCtrl = $controller('BaseCompareCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
