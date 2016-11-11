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

      return $http.get('/page/me', userId)
        .success(function(data) {
          return data.data;
        })
        .error(function() {
          return null;
        });
    },
    postStatus : function(data) {

      return $http.post('/page', data)
        .success(function(data) {
          console.log(data);
        })
        .error(function(data) {
          console.log(data);
          return null;
        });
    }
  }

}]);

