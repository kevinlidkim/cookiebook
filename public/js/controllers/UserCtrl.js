angular.module('UserCtrl', []).controller('UserController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', function($scope, $localStorage, $sessionStorage, UserService) {


  $scope.storage = $localStorage;
  $scope.newStatus = "";

  $scope.getUserData = function() {
    var user = UserService.getUserData();
    $scope.storage.user = user;
    $scope.storage.name = user.firstName + " " + user.lastName;

    var userId = $scope.storage.user.userId;
    UserService.getPersonalPageId(userId)
      .then(function(pageId) {
        $scope.storage.personalPageId = pageId.data.data;
      });
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

    console.log($scope.storage.personalPageId);

    console.log($scope.newStatus);
  }
  
}]);