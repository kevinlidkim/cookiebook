angular.module('ManagerCtrl', []).controller('ManagerController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', 'EmployeeService', 'ManagerService', function($scope, $localStorage, $sessionStorage, UserService, PageService, EmployeeService, ManagerService) {

  $scope.errorMessage = "";
  $scope.error = false;
  $scope.searchedSales = false;
  $scope.searchedCompany = false;
  $scope.searchedEmployee = false;

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

  $scope.searchAllEmployee = function() {
    if ($scope.employeeSearch && $scope.employeeSearch.name != "") {
      var query = {
        query: $scope.employeeSearch.name
      };
      ManagerService.searchAllEmployee(query)
        .then(function(data) {
          $scope.searchResults = data.data.data;
          $scope.searchedEmployee = true;
          $scope.employeeSearch = "";
        })
    }
  }

  $scope.getEmployeeData = function(employeeId) {
    var obj = {
      employeeId: employeeId
    };
    ManagerService.getEmployeeData(obj)
      .then(function(data) {
        $scope.storage.employeeData = data.data.data;
      })
  }

  $scope.simplifyPersonObj = function(personObj) {
    var obj = {}
    if (personObj != undefined) {
      if(personObj.firstName && personObj.firstName != "") {
        obj.firstName = personObj.firstName;
      }
      if(personObj.lastName && personObj.lastName != "") {
        obj.lastName = personObj.lastName;
      }
      if(personObj.address && personObj.address != "") {
        obj.address = personObj.address;
      }
      if(personObj.city && personObj.city != "") {
        obj.city = personObj.address;
      }
      if(personObj.state && personObj.state != "") {
        obj.state = personObj.state;
      }
      if(personObj.zipCode && personObj.zipCode != "") {
        obj.zipCode = personObj.zipCode;
      }
      if(personObj.telephone && personObj.telephone != "") {
        obj.telephone = personObj.telephone;
      }
      if(Object.keys(obj).length == 0) {
        return undefined;
      }
      else{
        return obj;
      }
    }
    else {
      return null;
    }
  }

  $scope.simplifyEmployeeObj = function(employeeObj) {
    if(employeeObj != undefined) {
      var obj = {}
      if(employeeObj.hourlyRate && employeeObj.hourlyRate != "") {
        obj.hourlyRate = employeeObj.hourlyRate;
      }
      if(Object.keys(obj).length == 0) {
        return undefined;
      }
      else{
        return obj;
      }
    }
    else {
      return null;
    }
  }

  $scope.updateEmployee = function() {
    var personObj = $scope.simplifyPersonObj($scope.employeePerson);
    var employeeObj = $scope.simplifyEmployeeObj($scope.employeeEmployee);
    var idObj = {
      employeeId: $scope.storage.employeeData.employeeId,
      personId: $scope.storage.employeeData.personId
    }
    console.log(personObj);
    //console.log(personObj.zipCode);
    //console.log(typeof personObj.zipCode);
    console.log(employeeObj);

    if(employeeObj) {
      $scope.error = false;
      var obj = {
        personObj: personObj,
        employeeObj: employeeObj,
        idObj: idObj
      }
      ManagerService.updateEmployee(obj)
        .then(function(data) {
          console.log(data);
          $scope.storage.employeeData = data.data.data;
        })
      if($scope.employeePerson == null || $scope.employeePerson == undefined) {
        $scope.employeePerson = {};
      }
      if($scope.employeeEmployee == null || $scope.employeeEmployee == undefined) {
        $scope.employeeEmployee = {};
      }
      $scope.employeePerson.firstName = "";
      $scope.employeePerson.lastName = "";
      $scope.employeePerson.address = "";
      $scope.employeePerson.city = "";
      $scope.employeePerson.state = "";
      $scope.employeePerson.zipCode = "";
      $scope.employeeEmployee.hourlyRate = "";
  } else if(personObj) {
      $scope.error = false;
      var obj = {
        personObj: personObj,
        employeeObj: employeeObj,
        idObj: idObj
      }
      ManagerService.updateEmployee(obj)
        .then(function(data) {
          if($scope.employeePerson == null || $scope.employeePerson == undefined) {
            $scope.employeePerson = {};
          }
          $scope.storage.employeeData = data.data.data;
          $scope.employeePerson.firstName = "";
          $scope.employeePerson.lastName = "";
          $scope.employeePerson.address = "";
          $scope.employeePerson.city = "";
          $scope.employeePerson.state = "";
          $scope.employeePerson.zipCode = "";
          $scope.employeePerson.telephone = "";
        })
    } else {
      $scope.errorMessage = "Cannot Update Data when fields are empty."
      $scope.error = true;
    }
  }

}]);
