angular.module('UserCtrl', []).controller('UserController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', function($scope, $localStorage, $sessionStorage, UserService, PageService) {

  $scope.storage = $localStorage;
  $scope.errorMessage = "";
  $scope.error = false;
  $scope.homeSearch = "";
  $scope.searched = false;

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

  $scope.updateProfile = function() {
    var personObj = $scope.profilePerson;
    var userObj = $scope.profileUser;

    if (userObj) {
      if ($scope.profileUser.password == $scope.profileUser.confirmPassword) {
        $scope.error = false;
        var obj = {
          personObj: personObj,
          userObj: userObj,
          idObj: $scope.storage.user
        }
        UserService.updateProfile(obj);
      } else {
        $scope.errorMessage = "Passwords do not match";
        $scope.error = true;
      }
    } else {
      $scope.error = false;
      var obj = {
        personObj: personObj,
        userObj: userObj,
        idObj: $scope.storage.user
      }
      UserService.updateProfile(obj);
    }

  }

  $scope.searchAll = function() {
    var query = {
      query: $scope.homeSearch
    }

    if ($scope.homeSearch != "") {
      UserService.searchAll(query)
        .then(function(data) {
         $scope.searchResults = data.data.data;
         $scope.searched = true;
         $scope.homeSearch = "";

         // console.log(data.data.data);
        })
    }
  }

  
}]);