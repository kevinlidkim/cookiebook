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
    // need to somehow get PAGEID as param to pass in
    // other params needed: user Id, newStatus text

    // retrieve personalpageid right after login?

    console.log($scope.newStatus);
  }
  
}]);