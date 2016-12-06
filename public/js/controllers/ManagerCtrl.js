angular.module('ManagerCtrl', []).controller('ManagerController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', 'EmployeeService', 'ManagerService', function($scope, $localStorage, $sessionStorage, UserService, PageService, EmployeeService, ManagerService) {
  
  $scope.loadSalesPage = function() {
    $scope.loadAllAds();
    $scope.loadMonthlyReport();
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
          $scope.storage.manager.monthlyReport = sales.data.data;
        })
    }
  }

  $scope.salesSearch = function() {

    if ($scope.searchField && $scope.searchField != "") {
      var obj = {
        query: $scope.searchField
      }
      ManagerService.salesSearchItem(obj)
        .then(function(sales) {
          $scope.storage.manager.salesSearchItem = sales.data.data;

          ManagerService.salesSearchUser(obj)
            .then(function(results) {
              console.log(results);
            })
        })
    }
  }

}]);

