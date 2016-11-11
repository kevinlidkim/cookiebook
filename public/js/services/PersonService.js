angular.module('PersonServ', []).factory('PersonService', ['$http', function($http) {
  
  return {
    storeUser : function(data) {
      localStorage.setItem('user', data.email);
    },
    getUser : function() {
      return localStorage.getItem('user');
    },
    signup : function(user) {
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
    get : function() {
      return $http.get('/api/persons');
    },
    create : function(person) {
      return $http.post('/api/persons', person)
        .then(function(res) {
          return res.data;
      });
    },
    delete : function(id) {
      return $http.delete('/api/persons' + id);
    }
  }

}]);

