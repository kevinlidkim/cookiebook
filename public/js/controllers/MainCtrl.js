angular.module('MainCtrl', []).controller('MainController', ['$scope', 'PersonService', function($scope, PersonService) {

  $scope.tagline = 'AYYYYYY';

  $scope.signUp = function(user) {

    $scope.tagline = 'you pressed signup';
    PersonService.create($scope.user).then(function(res) {
      $scope.response = res;
    });
  }
  
}]);

// angular.module('MainCtrl', []).controller('MainController', function($scope) {

//   $scope.tagline = 'AYYYYYY';

//   $scope.signUp = function(user) {

//     $scope.tagline = 'you pressed signup';
//   }
  
// });