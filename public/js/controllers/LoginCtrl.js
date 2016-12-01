angular.module('LoginCtrl', []).controller('LoginController', ['$scope', '$localStorage', '$sessionStorage', '$location', 'UserService', 'PageService', function($scope, $localStorage, $sessionStorage, $location, UserService, PageService) {

  $scope.storage = $localStorage;

  $scope.login = function () {

    $scope.error = false;
    $scope.disabled = true;
    $scope.errorMessage = "";

    UserService.login($scope.loginForm)
      .then(function() {
        $scope.loadAll();
      })
      .then(function () {
        $location.path('/');
        $scope.disabled = false;
        $scope.loginForm = {};
      })
      .catch(function () {
        $scope.error = true;
        $scope.errorMessage = "Invalid username and/or password";
        $scope.disabled = false;
        $scope.loginForm = {};
      });

  };

  $scope.loadAll = function () {
    var user = UserService.getUserData();
    if (user != null) {
      $scope.storage.user = user;
      $scope.storage.name = user.firstName + " " + user.lastName;
    }
    var friendObj = {
      you: $scope.storage.user.userId
    }
    UserService.getFriendData(friendObj)
      .then(function(data) {
        $scope.storage.friendData = data.data;

        var groupObj = {
          you: $scope.storage.user.userId
        }
        UserService.getGroupData(groupObj)
          .then(function(data) {
            $scope.storage.groupData = data.data.data;

            var userId = $scope.storage.user.userId;
              PageService.getPersonalPageId(userId)
                .then(function(pageId) {
                  $scope.storage.personalPageId = pageId.data.data;

                  var data = {
                    page: $scope.storage.personalPageId,
                    user: $scope.storage.user.userId
                  }

                  PageService.loadPage(data)
                    .then(function(pageData) {
                      $scope.storage.page = pageData;
                      // load messages afterwards
                    })
                })


          })

      })
  }
  
}]);

