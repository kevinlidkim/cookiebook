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

    searchAllCustomer : function(obj) {
      return $http.post('/query/customers', obj)
        .success(function(data) {
          return data;
        })
        .error(function(err) {
          console.log(err);
        })
    },

    updateCustomer : function(obj) {
      return $http.post('/customer/update', obj)
        .success(function(data) {
          console.log(data);
          return data;
        })
        .error(function(err) {
          console.log(err);
        })
    },

    createCustomer : function(obj) {
      return $http.post('/customer/create', obj)
        .success(function(data) {
          return data;
        })
        .error(function(err) {
          console.log(err);
        })
    },

    deleteCustomer : function(obj) {
      return $http.post('/customer/delete', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(err) {
          console.log(err);
        })
    },

    getCustomerData : function(obj) {
      return $http.post('/customer/get', obj)
        .success(function(data) {
          return data;
        })
        .error(function(err) {
          console.log(err);
        })
    },

    getCustomerGroup : function(obj) {
      return $http.post('/customer/group', obj)
        .success(function(data) {
          //console.log(data);
        })
        .error(function(err) {
          console.log(err);
        })
    },

    getCustomerTransactions : function(obj) {
      return $http.post('/customer/sales', obj)
        .success(function(data) {
          //console.log(data);
        })
        .error(function(err) {
          console.log(err);
        })
    },

    loadAdSuggestions : function(obj) {
      return $http.post('/loadSuggestedAds', obj)
        .success(function(data) {
          return data;
        })
        .error(function(err) {
          console.log(err);
        })
    }

  }


}]);
