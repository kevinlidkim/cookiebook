angular.module('PageServ', []).factory('PageService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

  var currentPage = null;

  return {

    loadPage : function(data) {
      return $http.post('/page', data)
        .success(function(data) {
          currentPage = data;
          return currentPage;
        })
        .error(function(data) {
          currentPage = null;
          return currentPage;
        })
    },

    getCurrentPage : function() {
      return currentPage;
    }
  }

}]);

