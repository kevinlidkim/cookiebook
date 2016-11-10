angular.module('UserServ', []).factory('UserService', ['$http', function($http) {
  
  return {
    get : function() {
      return $http.get('/api/persons');
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
          return res.data;
      });
    },
    delete : function(id) {
      return $http.delete('/api/persons' + id);
    }
  }

}]);

