angular.module('UserCtrl', []).controller('UserController', ['$location', '$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', function($location, $scope, $localStorage, $sessionStorage, UserService, PageService) {

  $scope.storage = $localStorage;
  $scope.errorMessage = "";
  $scope.noEntriesError = "No matching entries exist.";
  $scope.errorGroupSearchMessage = "";
  $scope.errorUserSearchMessage = "";
  $scope.errorGroupSearch = false;
  $scope.errorUserSearch = false;
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
          $scope.profilePerson.firstName = "";
          $scope.profilePerson.lastName = "";
          $scope.profilePerson.address = "";
          $scope.profilePerson.city = "";
          $scope.profilePerson.state = "";
          $scope.profilePerson.zipcode = "";
          $scope.profilePerson.telephone = "";
          $scope.profileUser.email = "";
          $scope.profileUser.password = "";
          $scope.profileUser.confirmPassword = "";
          $scope.profileUser.adPreferences = "";
          $scope.profilePerson.creditCard = "";
        })
    }

  }

  $scope.searchAll = function() {
    $scope.getUserData();
    var query = {
      query: $scope.homeSearch
    }
    $scope.errorUserSearchMessage = "";
    $scope.errorUserSearch = false;
    $scope.errorGroupSearchMessage = "";
    $scope.errorGroupSearch = false;
    //$scope.errorGroupSearchMessage = "";
    //$error.errorUserSearchMessage = "";
    if ($scope.homeSearch != "") {
      UserService.searchAll(query)
        .then(function(data) {
          $scope.searchResults = data.data.data;
          if($scope.searchResults.users.length == 0) {
            $scope.errorUserSearchMessage = $scope.noEntriesError;
            $scope.errorUserSearch = true;
          }
          if($scope.searchResults.groups.length == 0) {
            $scope.errorGroupSearchMessage = $scope.noEntriesError;
            $scope.errorGroupSearch = true;
          }
          $scope.errorMessage = "";
          $scope.error = false;
          $scope.searched = true;
          $scope.homeSearch = "";

         // console.log(data.data.data);
        })
    } else {
      $scope.searched = false;
      $scope.errorMessage = "Cannot Search when Name is empty."
      $scope.error = true;
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

  $scope.approveSendGroupRequest = function(groupId) {
    console.log(groupId);
    var obj = {
      user: $scope.storage.user.userId,
      group : groupId
    };
    UserService.approveSendGroupRequest(obj)
      .then(function(data) {
        $scope.getGroupData();
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

  // $scope.editGroup = function(groupId) {
  //   console.log(groupId);
  // }

  // this is a user sending a request to join a group
  $scope.joinGroupRequest = function(groupId) {
    obj = {
      you: $scope.storage.user.userId,
      group: groupId
    }
    UserService.joinGroupRequest(obj);
  }

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

  $scope.leaveGroup = function() {
    var obj = {
      group: $scope.storage.group,
      user: $scope.storage.user
    }
    UserService.leaveGroup(obj)
      .then(function(data) {
        $scope.getGroupData();
        $location.path('/groups');
      })
  }

  // $scope.removeGroupMember = function(member) {
  //   UserService.removeGroupMember(member)
  //     .then(function(data) {
  //       console.log(data);
  //       var obj = {
  //         id: $scope.storage.group.groupId
  //       };
  //       return PageService.loadGroupMembers(obj);
  //     })
  // }

    $scope.deleteGroup = function(groupId) {
    var obj = {
      groupId : groupId
    }
    UserService.deleteGroup(obj)
      .then(function(data) {
        //console.log(data);
        $scope.getGroupData();
      })
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
    var obj = message;
    UserService.deleteMessage(obj)
      .then(function(data) {
        // console.log(data);
        $scope.loadMessages();
      })
  }

  // $scope.checkEmployee = function() {
  //   if ($scope.storage.user) {
  //     var obj = {
  //       userId: $scope.storage.user.userId
  //     }
  //     UserService.isEmployee(obj)
  //       .then(function(status) {
  //         // return status.data.data;
  //         $scope.storage.isEmployee = status.data.data;
  //       })
  //   }
  // }

  $scope.isEmployee = function() {
    if ($scope.storage.isEmployee) {
      return true;
    } else {
      return false;
    }
  }

  $scope.isManager = function() {
    if ($scope.storage.isManager) {
      return true;
    } else {
      return false;
    }
  }

  $scope.loadPurchasePage = function(userAd) {
    $scope.storage.itemToPurchase = userAd;
  }

  $scope.purchaseItem = function() {
    var obj = {
      amount: $scope.quantity,
      ad: $scope.storage.itemToPurchase,
      account: $scope.chosenBankAccount
    }
    UserService.purchaseItem(obj)
      .then(function(data) {
        var update = {
          user: $scope.storage.user
        }
        PageService.loadAds(update)
        .then(function(ads) {
          $scope.storage.user.ads = ads.data.data;
          $location.path('/purchaseSuccess');
        })
      })
  }

  $scope.isOutOfStock = function(stock) {
    if (stock < 1) {
      return true;
    } else if ($scope.quantity == undefined) {
      return true;
    } else if (stock < $scope.quantity) {
      return true;
    } else if ($scope.chosenBankAccount == undefined) {
      return true;
    } else {
      return false;
    }
  }

  $scope.addBankAccount = function() {
    var bank = {
      accountNumber: $scope.newBankAccount,
      owner: $scope.storage.user.userId
    }
    if (bank) {
      UserService.addBankAccount(bank)
        .then(function(data) {
          // console.log(data);
          $scope.loadBankAccounts();
          $scope.newBankAccount = "";
        })
    }
  }

  $scope.loadBankAccounts = function() {
    var obj = {
      owner: $scope.storage.user.userId
    }
    UserService.loadBankAccounts(obj)
      .then(function(data) {
        $scope.storage.user.bankAccounts = data.data.data.accounts;
      })
  }

  $scope.deleteBankAccount = function(acc) {
    UserService.deleteBankAccount(acc)
      .then(function(data) {
        $scope.loadBankAccounts();
      })
  }

}]);
