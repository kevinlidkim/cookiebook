angular.module('PageServ', []).factory('PageService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

  return {

    loadPage : function(data) {
      return $http.post('/page', data)
        .success(function(data) {
          console.log(data);
        })
        .error(function(data) {
          console.log(data);
          return null;
        })
    }
  }

}]);

