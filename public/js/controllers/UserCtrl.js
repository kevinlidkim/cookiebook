angular.module('UserCtrl', []).controller('UserController', ['$scope', 'UserService', function($scope, UserService) {

  $scope.user = UserService.getUser();

  $scope.logout = function(user) {
    UserService.logout(user);
  }
  
}]);