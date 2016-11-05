angular.module('PersonService', []).factory('Person', ['$http', function($http) {
  
  return {
    get : function() {
      return $http.get('/api/persons');
    },
    create : function(oldPersonData) {
      return $http.post('/api/persons', oldPersonData);
    },
    delete : function(id) {
      return $http.delete('/api/persons' + id);
    }
  }

}]);

