angular.module('UserServ', []).factory('UserService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

  return {
    storeUser : function(data) {
      localStorage.setItem('user', data.email);
    },
    getUser : function() {
      return localStorage.getItem('user');
    },
    create : function(user) {
      return $http.post('/signup', user)
        .then(function(res) {
          return res.data;
      });
    },
    login : function(user) {
      return $http.post('/login', user)
        .then(function(res) {
          return res;
      });
    },
    logout : function() {
      return $http.post('/logout')
        .then(function(res) {
          return res;
        })
    },
    delete : function(id) {
      return $http.delete('/api/persons' + id);
    }
  }

}]);

