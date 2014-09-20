'use strict';

describe('Controller: BaseSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('postalyzerApp'));

  var BaseSearchCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BaseSearchCtrl = $controller('BaseSearchCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
