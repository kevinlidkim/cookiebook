angular.module('AuthCtrl', []).controller('AuthController', ['$scope', 'UserService', function($scope, UserService) {

  $scope.signUp = function(user) {
    UserService.create($scope.user).then(function(res) {
      $scope.response = res;
    });
  }
  
}]);