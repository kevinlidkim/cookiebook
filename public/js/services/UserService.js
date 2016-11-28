angular.module('UserServ', []).factory('UserService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

  var user = null;
  var loggedInUser = null;

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
    getPersonalPageId : function(userId) {
      return $http.get('/page/me')
        .success(function(data) {
          return data.data;
        })
        .error(function() {
          return null;
        });
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
          console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    acceptFriendRequest : function(obj) {
      return $http.post('/friend/accept', obj)
        .success(function(data) {
          console.log(data);
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    }
  }

}]);

