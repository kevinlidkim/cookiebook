angular.module('UserCtrl', []).controller('UserController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', function($scope, $localStorage, $sessionStorage, UserService, PageService) {


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

        var data = {
          page: $scope.storage.personalPageId,
          user: $scope.storage.user.userId
        }
        PageService.loadPage(data);
      });
  }

  $scope.logout = function(user) {
    UserService.logout(user);
  }

  $scope.isLoggedIn = function() {
    return UserService.isLoggedIn();
  }

  $scope.postStatus = function() {
    var data = {
      page: $scope.storage.personalPageId,
      user: $scope.storage.user.userId,
      content: $scope.newStatus,
      commentCount: 0,
      likes: 0
    };

    UserService.postStatus(data);
  }
  
}]);