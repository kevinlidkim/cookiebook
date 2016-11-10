angular.module('UserServ', []).factory('UserService', ['$http', function($http) {
  
  return {
    get : function() {
      return $http.get('/api/persons');
    },
    create : function(person) {
      return $http.post('/signup', person)
        .then(function(res) {
          return res.data;
      });
    },
    delete : function(id) {
      return $http.delete('/api/persons' + id);
    }
  }

}]);

