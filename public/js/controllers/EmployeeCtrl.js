angular.module('EmployeeCtrl', []).controller('EmployeeController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', 'EmployeeService', function($scope, $localStorage, $sessionStorage, UserService, PageService, EmployeeService) {

  $scope.errorMessage = "";
  $scope.error = false;
  $scope.searchedCustomer = false;

  $scope.createAd = function() {
    var adObj = $scope.ad;
    adObj.employeeId = $scope.storage.employee.employeeId;
    EmployeeService.createAd(adObj)
      .then(function(ad) {
        // console.log(ad);
        // append this ad to the bottom of the page and load the page again
        $scope.loadEmployeeAds();
      })
  }

  $scope.loadEmployeeAds = function() {
    var employeeObj = {
      employeeId: $scope.storage.employee.employeeId
    };
    EmployeeService.loadEmployeeAds(employeeObj)
      .then(function(data) {
        // console.log(data.data.data);
        $scope.storage.employee.ads = data.data.data.ads;
      })
  }

  $scope.deleteEmployeeAd = function(ad) {
    var employeeAd = ad;
    EmployeeService.deleteEmployeeAd(ad)
      .then(function(data) {
        // console.log(data);
        $scope.loadEmployeeAds();
      })
  }

  $scope.getCustomerMailingList = function() {
    var obj = {
      employeeId: $scope.storage.employee.employeeId
    };
    EmployeeService.getCustomerMailingList(obj)
      .then(function(data) {
        // console.log(data.data.data);
        $scope.customerMailingList = data.data.data;
      })
  }

  $scope.searchAllCustomer = function() {

    if ($scope.customerSearch && $scope.customerSearch != "") {
      var query = {
        query: $scope.customerSearch
      };
      EmployeeService.searchAllCustomer(query)
        .then(function(data) {
         $scope.searchResults = data.data.data;
         $scope.searchedCustomer = true;
         $scope.customerSearch = "";
         // console.log(data.data.data);
        })
    }
  }

  $scope.getCustomerData = function(userId) {
      var obj = {
        userId: userId
      }
      EmployeeService.getCustomerData(obj)
        .then(function(data) {
          $scope.storage.customerData = data.data.data;
        })
      EmployeeService.getCustomerGroup(obj)
        .then(function(groups) {
          $scope.storage.customerGroup = groups.data.data;
        })
      EmployeeService.getCustomerTransactions(obj)
        .then(function(sales) {
          $scope.storage.customerSales = sales.data.data;
        })
  }

}]);
