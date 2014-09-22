'use strict';

angular.module('postalyzerApp')
  .controller('SuccessCtrl', function ($scope, $cookieStore, $stateParams, $state) {
        $cookieStore.put('igToken', $stateParams.token);
        $state.go('base.user', { user_id: 'self'});
  });
