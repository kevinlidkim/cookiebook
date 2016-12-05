angular.module('EmployeeCtrl', []).controller('EmployeeController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', 'EmployeeService', function($scope, $localStorage, $sessionStorage, UserService, PageService, EmployeeService) {

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
  
}]);

