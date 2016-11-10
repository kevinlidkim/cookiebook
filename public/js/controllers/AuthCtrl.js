angular.module('AuthCtrl', []).controller('AuthController', ['$scope', '$window', 'UserService', function($scope, $window, UserService) {

  $scope.signUp = function(user) {
    UserService.create($scope.user);
  }

  $scope.login = function(user) {
    $scope.tagline = $scope.user.email;
    UserService.login($scope.user).
      then(function(res) {
        if(res.data.status === 'success') {
          $window.location.href = '/';
        }
        else {
          $window.location.href = '/login';
        }
      })
      .catch(function(err) {
        console.log('didnt log in correctly');
      });
  }
  
}]);