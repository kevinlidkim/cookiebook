angular.module('UserCtrl', []).controller('UserController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', function($scope, $localStorage, $sessionStorage, UserService, PageService) {

  $scope.storage = $localStorage;
  // $scope.newStatus = "";
  // $scope.newComment = [];

  $scope.getUserData = function() {
    var user = UserService.getUserData();
    if (user != null) {
      $scope.storage.user = user;
      $scope.storage.name = user.firstName + " " + user.lastName;
    }
  }

  $scope.logout = function(user) {
    UserService.logout(user);
  }

  $scope.isLoggedIn = function() {
    return UserService.isLoggedIn();
  }

  // $scope.postStatus = function() {
  //   if ($scope.newStatus != "") {
  //     var data = {
  //       page: $scope.storage.personalPageId,
  //       user: $scope.storage.user.userId,
  //       content: $scope.newStatus,
  //       commentCount: 0,
  //       likes: 0
  //     };

  //     UserService.postStatus(data)
  //       .then(function() {
  //         PageService.loadPage(data)
  //           .then(function(pageData) {
  //             $scope.storage.page = pageData;
  //           })
  //       });
  //   }
  // }
  
}]);