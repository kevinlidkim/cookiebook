angular.module('AuthCtrl', []).controller('AuthController', ['$scope', '$window', 'UserService', function($scope, $window, UserService) {

  $scope.signUp = function(user) {
    UserService.signup(user);
  }

  $scope.login = function(user) {
    UserService.login(user)
      .then(function(res) {
        if(res.data.status === 'success') {
          UserService.storeUser(user);

          // redirecting will cause all information on the page to be lost;
          // $window.location.href = '/profile';
        }
        else {
          // alert("bad credentials");
        }
      })
      .catch(function(err) {
      });
  }
  
}]);