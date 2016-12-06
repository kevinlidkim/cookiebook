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
          $scope.storage.manager.sales = sales.data.data;
        })
    }
  }

}]);

