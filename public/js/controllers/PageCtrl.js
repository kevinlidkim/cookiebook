angular.module('PageCtrl', []).controller('PageController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', function($scope, $localStorage, $sessionStorage, UserService, PageService) {
  
  $scope.storage = $localStorage;

  $scope.getUserPage = function() {
    var user = UserService.getUserData()
    if (user != null) {
      $scope.storage.user = user;
      $scope.storage.name = user.firstName + " " + user.lastName;
    }

    var userId = $scope.storage.user.userId;
    UserService.getPersonalPageId(userId)
      .then(function(pageId) {
        $scope.storage.personalPageId = pageId.data.data;

        var data = {
          page: $scope.storage.personalPageId,
          user: $scope.storage.user.userId
        }
        PageService.loadPage(data)
          .then(function(pageData) {
            $scope.storage.page = pageData;
          })
      });
  }

}]);