angular.module('PageCtrl', []).controller('PageController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', function($scope, $localStorage, $sessionStorage, UserService, PageService) {


  $scope.storage = $localStorage;
  $scope.newStatus = "";
  $scope.newComment = [];
  $scope.newFriendComment = [];
  $scope.newGroupStatus = "";
  $scope.newGroupComment = [];

  $scope.getUserPage = function() {
    var user = UserService.getUserData()
    if (user != null) {
      $scope.storage.user = user;
      $scope.storage.name = user.firstName + " " + user.lastName;
    }

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

    PageService.getFriendPageId(obj)
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

  $scope.getGroupPage = function(group) {
    $scope.storage.group = group;

    var obj = {
      id: group.groupId
    }

    PageService.getGroupPageId(obj)
      .then(function(pageId) {
        $scope.storage.groupPageId = pageId.data.data;

        var data = {
          page: $scope.storage.groupPageId,
          group: group.groupId
        }

        PageService.loadPage(data)
          .then(function(pageData) {
            $scope.storage.groupPage = pageData;
            // console.log(pageData);
            return PageService.loadGroupRequests(data)
          })
          .then(function(requestData) {
            $scope.storage.groupRequest = requestData.data.requests;
          })
      })
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

  $scope.postGroupStatus = function() {
    if ($scope.newGroupStatus != "") {
      var data = {
        page: $scope.storage.groupPageId,
        user: $scope.storage.user.userId,
        content: $scope.newGroupStatus,
        commentCount: 0,
        likes: 0
      };

      PageService.postStatus(data)
        .then(function() {
          PageService.loadPage(data)
            .then(function(pageData) {
              $scope.storage.groupPage = pageData;
              $scope.newGroupStatus = "";
            })
        });
    }
  }

  $scope.postGroupComment = function(index, postId) {

    console.log(index);
    console.log(postId);

    if ($scope.newGroupComment[index] !="" && $scope.newGroupComment[index]) {
      var data = {
        page: $scope.storage.groupPageId,
        post: postId,
        user: $scope.storage.user.userId,
        content: $scope.newGroupComment[index],
        likes: 0
      };

      PageService.postComment(data)
        .then(function() {
          PageService.loadPage(data)
            .then(function(pageData) {
              $scope.storage.groupPage = pageData;
              $scope.newGroupComment[index] = "";
            })
        })

    }
  },

  $scope.isGroupOwner = function() {
    var owner = false;
    var groups = $scope.storage.groupData.ownsGroup;
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].groupId == $scope.storage.group.groupId) {
        owner = true;
      }
    }
    return owner;
  }

  $scope.approveJoinRequest = function(userId) {
    var obj = {
      user: userId,
      group: $scope.storage.group.groupId
    };
    UserService.approveJoinRequest(obj)
      .then(function(data) {
        $scope.getGroupPage($scope.storage.group);
      })
  }

}]);