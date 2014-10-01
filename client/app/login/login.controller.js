'use strict';

angular.module('postalyzerApp')
  .controller('LoginCtrl', function ($scope, $window, $state, $cookieStore) {
    $scope.login = function(){
        $window.location.assign('/api/igs/authorize_user');
    };

    if ($cookieStore.get('igToken')) {
        $state.go('base.user', {'user_id': 'self'});
    }
  });
