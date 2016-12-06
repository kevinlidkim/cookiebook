angular.module('EmployeeServ', []).factory('EmployeeService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

  return {

    createAd : function(obj) {
      return $http.post('/createAd', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        });
    },

    loadEmployeeAds : function(obj) {
      return $http.post('/loadEmployeeAds', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    },

    deleteEmployeeAd : function(obj) {
      return $http.post('/deleteEmployeeAd', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    },

    getCustomerMailingList : function(obj) {
      return $http.post('/getCustomerMailingList', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    }

  }


}]);
