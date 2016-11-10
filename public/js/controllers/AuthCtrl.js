angular.module('AuthCtrl', []).controller('AuthController', ['$scope', 'UserService', function($scope, UserService) {

  $scope.signUp = function(user) {
    UserService.create($scope.user);
  }

  $scope.login = function(user) {
    $scope.tagline = $scope.user.email;
    UserService.login($scope.user);
  }
  
}]);