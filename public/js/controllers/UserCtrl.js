angular.module('UserCtrl', []).controller('UserController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', function($scope, $localStorage, $sessionStorage, UserService) {


  $scope.storage = $localStorage;
  $scope.newStatus = "";

  $scope.getUserData = function() {
    var user = UserService.getUserData();
    $scope.storage.user = user;
    $scope.storage.name = user.firstName + " " + user.lastName;
  }

  $scope.logout = function(user) {
    UserService.logout(user);
  }

  $scope.isLoggedIn = function() {
    return UserService.isLoggedIn();
  }

  $scope.postStatus = function() {
    console.log($scope.newStatus);
  }
  
}]);