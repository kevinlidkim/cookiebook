angular.module('ManagerServ', []).factory('ManagerService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

  return {

    loadAllAds : function() {
      return $http.get('/loadAllAds')
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    },
    loadMonthlyReport : function(obj) {
      return $http.post('/loadMonthlyReport', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    }

  }


}]);
