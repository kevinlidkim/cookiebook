angular.module('PersonService', []).factory('Person', ['$http', function($http) {
  
  return {
    get : function() {
      return $http.get('/api/persons');
    },
    create : function(personData) {
      return $http.post('/api/persons', personData);
    },
    delete : function(id) {
      return $http.delete('/api/persons' + id);
    }
  }

}]);