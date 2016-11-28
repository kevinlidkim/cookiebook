angular.module('PageCtrl', []).controller('PageController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', function($scope, $localStorage, $sessionStorage, UserService, PageService) {


  $scope.storage = $localStorage;
  $scope.newStatus = "";
  $scope.newComment = [];
  $scope.newFriendComment = [];

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
            // console.log(pageData);
          })
      });
  }

  $scope.getFriendPage = function(friend) {
    $scope.storage.friend = friend;
    // var friendId = $scope.storage.friend.userId;
    var obj = {
      id: friend.userId
    }

    UserService.getFriendPageId(obj)
      .then(function(pageId) {
        $scope.storage.friendPageId = pageId.data.data;

        var data = {
          page: $scope.storage.friendPageId,
          user: $scope.storage.friend.userId
        }

        PageService.loadPage(data)
          .then(function(pageData) {
            $scope.storage.friendPage = pageData;
            // console.log(pageData);
          })
      });
  }

  $scope.postStatus = function() {
    if ($scope.newStatus != "") {
      var data = {
        page: $scope.storage.personalPageId,
        user: $scope.storage.user.userId,
        content: $scope.newStatus,
        commentCount: 0,
        likes: 0
      };

      PageService.postStatus(data)
        .then(function() {
          PageService.loadPage(data)
            .then(function(pageData) {
              $scope.storage.page = pageData;
              $scope.newStatus = "";
            })
        });
    }
  }

  $scope.postComment = function(index, postId) {
    if ($scope.newComment[index] !="" && $scope.newComment[index]) {
      var data = {
        page: $scope.storage.personalPageId,
        post: postId,
        user: $scope.storage.user.userId,
        content: $scope.newComment[index],
        likes: 0
      };

      PageService.postComment(data)
        .then(function() {
          PageService.loadPage(data)
            .then(function(pageData) {
              $scope.storage.page = pageData;
              $scope.newComment[index] = "";
            })
        })

    }
  }

  $scope.postFriendComment = function(index, postId) {
    if ($scope.newFriendComment[index] !="" && $scope.newFriendComment[index]) {
      var data = {
        page: $scope.storage.friendPageId,
        post: postId,
        user: $scope.storage.user.userId,
        content: $scope.newFriendComment[index],
        likes: 0
      };

      PageService.postComment(data)
        .then(function() {
          PageService.loadPage(data)
            .then(function(pageData) {
              $scope.storage.friendPage = pageData;
              $scope.newFriendComment[index] = "";
            })
        })

    }
  }

}]);