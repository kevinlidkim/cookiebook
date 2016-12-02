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
    return user;
  }

  $scope.logout = function(user) {
    UserService.logout(user);
  }

  $scope.isLoggedIn = function() {
    if ($scope.storage.user) {
      return true;
    } else {
      return false;
    }
    // return UserService.isLoggedIn();
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
      UserService.updateProfile(obj)
        .then(function() {
          var user = UserService.getUserData();
          $scope.storage.user = user;
          $scope.storage.name = user.firstName + " " + user.lastName;
        })
    }

  }

  $scope.searchAll = function() {
    $scope.getUserData();
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

  $scope.sendFriendRequest = function(userId) {
    if (userId == $scope.storage.user.userId) {
      // console.log('you cant add yourself');
    } else {
      obj = {
        you: $scope.storage.user.userId,
        friend: userId
      }
      UserService.sendFriendRequest(obj);
    }
  }

  $scope.getFriendData = function() {
    $scope.getUserData();
    var obj = {
      you: $scope.storage.user.userId
    }
    UserService.getFriendData(obj)
      .then(function(data) {
        $scope.storage.friendData = data.data;
        // console.log($scope.storage.friendData);
      })
  }

  $scope.acceptFriendRequest = function(friendId) {
    var obj = {
      you: $scope.storage.user.userId,
      friend: friendId
    };
    UserService.acceptFriendRequest(obj)
      .then(function(data) {
        $scope.getFriendData();
      })
  }

  $scope.createGroup = function() {
    var obj = {
      you: $scope.storage.user.userId,
      groupName: $scope.newGroup.groupName,
      type: $scope.newGroup.type
    };
    if ($scope.newGroup.groupName && $scope.newGroup.type && $scope.newGroup.groupName != "" && $scope.newGroup.type != "") {
      UserService.createGroup(obj)
        .then(function(data) {
          $scope.newGroup.groupName = "";
          $scope.newGroup.type = "";
          
          $scope.getGroupData();
        })
    }
  }

  $scope.getGroupData = function() {
    $scope.getUserData();
    var obj = {
      you: $scope.storage.user.userId
    }
    UserService.getGroupData(obj)
      .then(function(data) {
        // console.log(data.data.data);
        $scope.storage.groupData = data.data.data;
      })
  }

  $scope.editGroup = function(groupId) {
    console.log(groupId);
  }

  // this is a user sending a request to join a group
  $scope.joinGroupRequest = function(groupId) {
    obj = {
      you: $scope.storage.user.userId,
      group: groupId
    }
    UserService.joinGroupRequest(obj);
  }

  // this is a group page owner sending a request for a user to join
  $scope.sendGroupRequest = function() {
































  }

  $scope.createMessage = function(user) {
    $scope.storage.userToMessage = user;
  }

  $scope.sendMessage = function(newMessage) {
    if (newMessage) {
      if (newMessage.content && newMessage.subject) {
        if (newMessage.content != "" && newMessage.subject != "") {
          var obj = {
            sender: $scope.storage.user.userId,
            receiver: $scope.storage.userToMessage.userId,
            content: newMessage.content,
            subject: newMessage.subject
          }
          UserService.sendMessage(obj)
            .then(function() {
              $scope.newMessage.subject = "";
              $scope.newMessage.content = "";
            })
        }
      }
    }
  }

  $scope.loadMessages = function() {
    $scope.getUserData();
    var obj = $scope.storage.user;
    UserService.loadMessages(obj)
      .then(function(data) {
        $scope.storage.listOfMessages = data.data.data;
        // console.log(data.data.data);
      })
  }

  $scope.deleteMessage = function(message) {
    console.log(message);
  }

  
}]);