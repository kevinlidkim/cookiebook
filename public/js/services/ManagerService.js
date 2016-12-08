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
    },
    salesSearchUser : function(obj) {
      return $http.post('/salesSearchUser', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    },
    salesSearchItem : function(obj) {
      return $http.post('/salesSearchItem', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    },
    companySearch : function(obj) {
      return $http.post('/companySearch', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    },
    getRichestUser : function() {
      return $http.get('/getRichestUser')
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    },
    getBestEmployee : function() {
      return $http.get('/getBestEmployee')
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    },
    searchAllEmployee : function(obj) {
      return $http.post('/query/employees', obj)
        .success(function(data) {
          return data;
        })
        .error(function(data) {
          console.log(data);
        })
    },
    getEmployeeData : function(obj) {
      return $http.post('/employee/get', obj)
        .success(function(data) {
          return data;
        })
        .error(function(err) {
          console.log(err);
        })
    },
    updateEmployee : function(obj) {
      return $http.post('/employee/update', obj)
        .success(function(data) {
          return data;
        })
        .error(function(err) {
          console.log(err);
        })
    }

  }


}]);
