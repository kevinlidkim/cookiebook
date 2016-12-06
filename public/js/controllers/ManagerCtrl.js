angular.module('ManagerCtrl', []).controller('ManagerController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', 'EmployeeService', 'ManagerService', function($scope, $localStorage, $sessionStorage, UserService, PageService, EmployeeService, ManagerService) {
  
  $scope.loadSalesPage = function() {
    $scope.loadAllAds();
    $scope.loadAllSales();
  }

  $scope.loadAllAds = function() {

    ManagerService.loadAllAds()
      .then(function(ads) {
        $scope.storage.manager.ads = ads.data.data;
      })
  }

  $scope.loadAllSales = function() {

    ManagerService.loadAllSales()
      .then(function(sales) {
        $scope.storage.manager.sales = sales.data.data;
      })
  }

}]);

