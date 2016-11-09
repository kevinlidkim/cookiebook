angular.module('PersonServ', []).factory('PersonService', ['$http', function($http) {
  
  return {
    get : function() {
      return $http.get('/api/persons');
    },
    create : function(person) {
      return $http.post('/api/persons', person)
        .then(function(res) {
          console.log('person service res');
          console.log(res);
          return res.data;
      });
    },
    delete : function(id) {
      return $http.delete('/api/persons' + id);
    }
  }

}]);

