angular.module('PageCtrl', []).controller('PageController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', function($scope, $localStorage, $sessionStorage, UserService, PageService) {

  $scope.storage = $localStorage;
  $scope.newStatus = "";
  $scope.newComment = [];

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
    if ($scope.newComment[index] !="") {
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

}]);