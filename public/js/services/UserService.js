angular.module('UserServ', []).factory('UserService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

  var user = null;
  var loggedInUser = null;
  var editedGroup = null;

  return {

    signup : function(userData) {
      var deferred = $q.defer();

      $http.post('/signup', userData)
        .success(function(data, status) {
          if (status === 200 && data.status) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        .error(function(data) {
          deferred.reject();
        })
        return deferred.promise;
    },
    login : function(userData) {
      var deferred = $q.defer();

      $http.post('/login', userData)
        .success(function(data, status) {
          if (status === 200 && data.status) {
            loggedInUser = JSON.parse(JSON.stringify(data.user));
            user = true;
            deferred.resolve();
          } else {
            loggedInUser = null;
            user = false;
            deferred.reject();
          }
        })
        .error(function(data) {
          loggedInUser = null;
          user = false;
          deferred.reject();
        });
        return deferred.promise;
    },
    logout : function() {
      var deferred = $q.defer();

      $http.get('/logout')
        .success(function(data) {
          loggedInUser = null;
          user = false;
          deferred.resolve();
        })
        .error(function(data) {
          loggedInUser = null;
          user = false;
          deferred.reject();
        })
        return deferred.promise;
    },
    isLoggedIn : function() {
      if (user) {
        return true;
      } else {
        return false;
      }
    },
    isAuth : function() {
      if (user) {
        return true;
      } else {
        return false;
      }
    },

    getUserStatus : function() {
      return $http.get('/status')
        .success(function(data) {
          if (data.status) {
            user = true;
          } else {
            user = false;
          }
        })
        .error(function(data) {
          user = false;
        });
    },
    getUserData : function() {
      return loggedInUser;
    },
    getUpdatedGroupData : function() {
      return editedGroup;
    },
    updateProfile : function(obj) {
      return $http.post('/update', obj)
        .success(function(data) {
          console.log(data);
          loggedInUser = JSON.parse(JSON.stringify(data.data));
        })
        .error(function(data) {
          console.log(data);
        })
    },
    searchAll : function(query) {
      return $http.post('/query/all', query)
        .success(function(data) {
          // console.log(data);
          return data;
        })
        .error(function(data) {
          // console.log(data);
        })
    },
    sendFriendRequest : function(obj) {
      return $http.post('/friend/request', obj)
        .success(function(data) {
          console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    getFriendData : function(userId) {
      return $http.post('/friend/get', userId)
        .success(function(data) {
          // console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    acceptFriendRequest : function(obj) {
      return $http.post('/friend/accept', obj)
        .success(function(data) {
          // console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    createGroup : function(obj) {
      return $http.post('/group/create', obj)
        .success(function(data) {
          // console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    getGroupData : function(obj) {
      return $http.post('/groups/get', obj)
        .success(function(data) {
          // console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    joinGroupRequest : function(obj) {
      return $http.post('/group/joinRequest', obj)
        .success(function(data) {
          // console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    sendGroupRequest : function(obj) {
      return $http.post('/group/sendRequest', obj)
        .success(function(data) {
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    approveJoinRequest : function(obj) {
      return $http.post('/group/approveRequest', obj)
        .success(function(data) {
          // console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    approveSendGroupRequest : function(obj) {
      return $http.post('/group/approveSendGroupRequest', obj)
        .success(function(data) {
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    leaveGroup : function(obj) {
      return $http.post('/group/leave', obj)
        .success(function(data) {
          // console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    removeGroupMember : function(obj) {
      return $http.post('/group/remove', obj)
        .success(function(data) {
          // console.log(data);
        })
        error(function(data) {
          console.log(data);
        })
    },
    deleteGroup : function(obj) {
      return $http.post('/group/delete', obj)
        .success(function(data) {
          // console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    sendMessage : function(obj) {
      return $http.post('/sendMessage', obj)
        .success(function(data) {
          // console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    loadMessages : function(obj) {
      return $http.post('/loadMessages', obj)
        .success(function(data) {
          // console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    deleteMessage : function(obj) {
      return $http.post('/deleteMessage', obj)
        .success(function(data) {
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    isEmployee : function(obj) {
      return $http.post('/isEmployee', obj)
        .success(function(data) {
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    isManager: function(obj) {
      return $http.post('/isManager', obj)
        .success(function(data) {
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    addBankAccount : function(obj) {
      return $http.post('/addBankAccount', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    },
    loadBankAccounts : function(obj) {
      return $http.post('/loadBankAccounts', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    },
    deleteBankAccount : function(obj) {
      return $http.post('/deleteBankAccount', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    },
    purchaseItem : function(obj) {
      return $http.post('/purchaseItem', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    }
  }

}]);
