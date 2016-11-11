angular.module('UserCtrl', []).controller('UserController', ['$scope', 'UserService', function($scope, UserService) {

  // $scope.user = get user by querying server

  $scope.logout = function(user) {
    UserService.logout(user);
  }
  
}]);