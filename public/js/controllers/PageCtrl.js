angular.module('PageCtrl', []).controller('PageController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', function($scope, $localStorage, $sessionStorage, UserService, PageService) {

  $scope.storage = $localStorage;
  $scope.newStatus = "";
  $scope.newComment = [];
  $scope.newFriendComment = [];
  $scope.newGroupStatus = "";
  $scope.newGroupComment = [];
  $scope.commented_By=[];
  $scope.comment_By_PersonId=[];
  $scope.isMyComment=[];
  $scope.groupSearch = "";
  $scope.searched = false;

  $scope.getUserPage = function() {
    var user = UserService.getUserData();
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
            $scope.loadAds();
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
            console.log(pageData);
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

      console.log($scope.storage);

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

  $scope.deleteComment = function(commentId) {
    if(commentId != null) {
      var data = {
        comment: commentId
      }

      PageService.deleteComment(data)
        .then(function() {
          $scope.getUserPage();
          $scope.getFriendPage($scope.storage.friend);
        })
    }
  }

  $scope.deletePost = function(postId) {

    var postArray = $scope.storage.page.data.finalData
    console.log(postArray);

    for(post in postArray){
      console.log(postArray[post]);

      if(postArray[post].postId == postId) {
        console.log("Found postId... beginning to delete Post")

        var commentArray = postArray[post].comments;
        //DELETE ALL COMMENTS ON THE POST.
        for(var j = 0; j < commentArray.length; j++) {

          $scope.deleteComment(commentArray[j].commentId);
        }

        //BEGIN DELETING POST.

        var postData = {
          post : postId
        }

        PageService.deletePost(postData)
          .then(function() {
            $scope.getUserPage();
          })

      }

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

  $scope.likesPost = function(postId) {
    if(postId != null) {
      var data = {
        post: postId,
        user: $scope.storage.user.userId
      }

      PageService.likesPost(data)
        .then(function(){
          $scope.getUserPage(); //updates storage so that checkLikePost will be accurate
          })
    }

  }

  $scope.likesComment = function(commentId) {
    if(commentId != null) {
      var data = {
        comment: commentId,
        user: $scope.storage.user.userId
      }

      PageService.likesComment(data)
        .then(function(){
          $scope.getUserPage(); //updates storage so that checkLikePost will be accurate
        })
    }
  }

  $scope.checkLikesPost = function(postId) {

    var array = $scope.storage.page.data.pageData.arrayOfLikesPost;
    var found = false;

    for(var i = 0; i < array.length; i++){
        if(array[i].post == postId){
          found = true;
          break;
        }
    }
    return found;
  }

  $scope.checkLikesComment = function(commentId) {

    var array = $scope.storage.page.data.pageData.arrayOfLikesComment;
    var found = false;

    for(var i = 0; i < array.length; i++){
        if(array[i].comment == commentId){
          found = true;
          break;
        }
    }
    return found;
  }

  $scope.commentedBy = function(index, commentId) {

    if(commentId != null) {
      var data = {
        comment: commentId,
        user: $scope.storage.user.userId
      }

    }

    PageService.commentedBy(data)
        .then(function(personData){
          $scope.commented_By[index] = personData.data.data.firstName + " " + personData.data.data.lastName;
          $scope.comment_By_PersonId[index] = personData.data.data.personId;
        })
  }

  $scope.isMyComment = function(index) {

      if($scope.comment_By_PersonId[index] == $scope.storage.user.userId) {
          return true;
      }
    return false;
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

  $scope.isGroupMember = function() {
    var member = false;
    var groups = $scope.stroage.groupData.memberOfGroup;
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].groupId == $scope.storage.group.groupId) {
        member = true;
      }
    }
    return member;
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

  $scope.searchAllFromGroup = function() {
    //$scope.getUserData();

    var query = {
      query: $scope.groupSearch
    }

    if ($scope.groupSearch != "") {
      UserService.searchAll(query)
        .then(function(data) {
         $scope.searchResults = data.data.data;
         $scope.searched = true;
         $scope.groupSearch = "";

         // console.log(data.data.data);
        })
    }
  }

  // this is a group page owner sending a request for a user to join
  $scope.sendGroupRequest = function(userId) {
    if (userId == $scope.storage.user.userId) {
        // console.log('you cant add yourself');
      } else {
        obj = {
          user: userId,
          group: $scope.storage.group.groupId
        }
        UserService.sendGroupRequest(obj);
    }
  }

  $scope.loadAds = function() {

    var data = {
      user: $scope.storage.user
    };
    PageService.loadAds(data)
      .then(function(ads) {
        // console.log(ads);
        $scope.storage.user.ads = ads.data.data;
      })
  }

  $scope.updateGroup = function(groupId) {
    var groupObj = $scope.profileGroup;

    if (groupObj) {
      if ($scope.profileGroup.groupName != "" && $scope.profileGroup.type != "") {
        $scope.error = false;
        var obj = {
          groupObj: groupObj,
          groupId: groupId
        }
        PageService.updateGroup(obj)
          .then(function(data) {
            $scope.getGroupPage(data.data.data);
          })
      } else {
        $scope.errorMessage = "Group Data Fields cannot be empty.";
        $scope.error = true;
      }
    } else {
      $scope.error = false;
      console.log(451)
    }
  }
}]);
