angular.module('LogoutCtrl', []).controller('LogoutController', ['$scope', '$localStorage', '$sessionStorage', '$location', 'UserService', function($scope, $localStorage, $sessionStorage, $location, UserService) {

  $scope.logout = function () {

    UserService.logout()
      .then(function() {
        $localStorage.$reset();

        $location.path('/login');
      });

  };
  
}]);

