angular.module('EmployeeServ', []).factory('EmployeeService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

  return {

    createAd : function(obj) {
      return $http.post('/createAd', obj)
        .success(function(data){
          // console.log(data);
        })
        .error(function(data){
          console.log(data);
        });
    }

  }


}]);
