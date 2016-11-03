angular.module('PersonService', []).factory('Person', ['$http', function($http) {
  
  return {
    get : function() {
      return $http.get('/api/oldpersons');
    },
    create : function(oldPersonData) {
      return $http.post('/api/oldpersons', oldPersonData);
    },
    delete : function(id) {
      return $http.delete('/api/oldpersons' + id);
    }
  }

}]);