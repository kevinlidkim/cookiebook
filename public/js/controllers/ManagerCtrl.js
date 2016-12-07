angular.module('ManagerCtrl', []).controller('ManagerController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', 'EmployeeService', 'ManagerService', function($scope, $localStorage, $sessionStorage, UserService, PageService, EmployeeService, ManagerService) {
  
  $scope.searchedSales = false;
  $scope.searchedCompany = false;

  $scope.loadSalesPage = function() {
    $scope.loadAllAds();
    $scope.getRichestUser();
  }

  $scope.loadAllAds = function() {

    ManagerService.loadAllAds()
      .then(function(ads) {
        $scope.storage.manager.ads = ads.data.data;
      })
  }

  $scope.loadMonthlyReport = function() {

    if ($scope.chosenMonth) {
      var obj = {
        month: $scope.chosenMonth
      }
      ManagerService.loadMonthlyReport(obj)
        .then(function(sales) {
          $scope.monthlyReport = sales.data.data;
        })
    }
  }

  $scope.salesSearch = function() {

    if ($scope.searchField && $scope.searchField != "") {
      var obj = {
        query: $scope.searchField
      }
      $scope.searchedSales = true;
      ManagerService.salesSearchItem(obj)
        .then(function(sales) {
          $scope.salesSearchItem = sales.data.data;
        })
      ManagerService.salesSearchUser(obj)
        .then(function(results) {
          $scope.salesSearchUser = results.data.data;
        })
    }
  }

  $scope.companySearch = function() {

    if ($scope.searchCompanyName && $scope.searchCompanyName != "") {
      var obj = {
        query: $scope.searchCompanyName
      }
      $scope.searchedCompany = true;
      ManagerService.companySearch(obj)
        .then(function(data) {
          $scope.companyAds = data.data.data.ads;
        })
    }
  }

  $scope.getRichestUser = function() {

    ManagerService.getRichestUser()
      .then(function(data) {
        // console.log(data.data.data);
        $scope.storage.richestUser = data.data.data;
      })
  }

  $scope.getBestEmployee = function() {

    ManagerService.getBestEmployee()
      .then(function(data) {
        $scope.storage.bestEmployee = data.data.data;
      })
  }

}]);

