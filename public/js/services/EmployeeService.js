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
    },

    searchAllCustomer : function(query) {
      return $http.post('/query/customers', query)
        .success(function(data) {
          return data;
        })
        .error(function(err) {
          console.log(data);
        })
    },

    updateCustomer : function(obj) {
      return $http.post('/customer/update', obj)
        .success(function(data) {
          console.log(data);
          return data;
        })
        .error(function(err) {
          console.log(data);
        })
    },

    getCustomerData : function(obj) {
      return $http.post('/customer/get', obj)
        .success(function(data) {
          return data;
        })
        .error(function(err) {
          console.log(data);
        })
    }

  }


}]);
