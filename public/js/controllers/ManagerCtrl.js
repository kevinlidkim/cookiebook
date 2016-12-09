angular.module('ManagerCtrl', []).controller('ManagerController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', 'EmployeeService', 'ManagerService', function($scope, $localStorage, $sessionStorage, UserService, PageService, EmployeeService, ManagerService) {

  $scope.storage.newEmployeeUserId;
  $scope.errorMessage = "";
  $scope.noEntriesError = "No matching entries exist.";
  $scope.errorMessageEmployeeSearchResults = "";
  $scope.errorEmployeeSearchResults = false;
  $scope.errorMessageEmployeeSearch = "";
  $scope.errorEmployeeSearch = false;
  $scope.searchedSales = false;
  $scope.searchedCompany = false;
  $scope.searchedEmployee = false;
  $scope.errorMessageCustomerSearchResults = "";
  $scope.errorCustomerSearchResults = false;
  $scope.errorMessageCustomerSearch = "";
  $scope.errorCustomerSearch = false;
  $scope.searchedCustomer = false;
  $scope.customerCreated = false;
  $scope.employeeCreated = false;

  $scope.searchFieldItemRevenue = "";
  $scope.searchFieldItemTypeRevenue = "";
  $scope.searchFieldCustomerRevenue = "";
  $scope.searchedItemRevenue = false;
  $scope.salesItemTotalSold = 0;
  $scope.salesItemTotalRevenue = 0;


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

  $scope.salesSearchItemRevenue = function() {

    $scope.salesItemName = $scope.searchFieldItemRevenue;
    var unitsSold = 0;
    var totalRevenue = 0;

    if ($scope.searchFieldItemRevenue && $scope.searchFieldItemRevenue != "") {
      var obj = {
        query: $scope.searchFieldItemRevenue
      }

      $scope.searchedItemRevenue = true;

      ManagerService.salesSearchItem(obj)
        .then(function(sales) {
          $scope.salesSearchItem = sales.data.data;

          console.log(sales)

          if($scope.salesSearchItem != null){

            for(var i = 0; i < $scope.salesSearchItem.length; i++) {
              unitsSold += $scope.salesSearchItem[i].numberOfUnits;
              totalRevenue += $scope.salesSearchItem[i].unitPrice * $scope.salesSearchItem[i].numberOfUnits;
            }
          }
            $scope.salesItemTotalSold = unitsSold;
            $scope.salesItemTotalRevenue = totalRevenue;
        })
      // ManagerService.salesSearchUser(obj)
      //   .then(function(results) {
      //     $scope.salesSearchUser = results.data.data;
      //   })
    }

  }

  $scope.salesSearchItemTypeRevenue = function() {

    $scope.salesItemTypeName = $scope.searchFieldItemTypeRevenue;
    var unitsSold = 0;
    var totalRevenue = 0;

    if ($scope.searchFieldItemTypeRevenue && $scope.searchFieldItemTypeRevenue != "") {
      var obj = {
        query: $scope.searchFieldItemTypeRevenue
      }

      $scope.searchedItemTypeRevenue = true;

      ManagerService.salesSearchItemType(obj)
        .then(function(sales) {

          console.log(sales)

          $scope.salesSearchItemType = sales.data.data;
          
          if($scope.salesSearchItemType != null){

            for(var i = 0; i < $scope.salesSearchItemType.length; i++) {
              unitsSold += $scope.salesSearchItemType[i].numberOfUnits;
              totalRevenue += $scope.salesSearchItemType[i].unitPrice * $scope.salesSearchItemType[i].numberOfUnits;
            }
          }
            $scope.salesItemTypeTotalSold = unitsSold;
            $scope.salesItemTypeTotalRevenue = totalRevenue;
        })
      // ManagerService.salesSearchUser(obj)
      //   .then(function(results) {
      //     $scope.salesSearchUser = results.data.data;
      //   })
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

  $scope.searchAllCustomer = function() {
    $scope.errorMessageCustomerSearchResults = "";
    $scope.errorCustomerSearchResults = false;
    $scope.errorMessageCustomerSearch = "";
    $scope.errorCustomerSearch = false;
    $scope.errorEmployeeSearch = false;
    $scope.searchedEmployee = false;

    if ($scope.customerSearch && $scope.customerSearch.name != "") {
      var query = {
        query: $scope.customerSearch.name
      };
      EmployeeService.searchAllCustomer(query)
        .then(function(data) {
          $scope.searchResults = data.data.data;
          console.log($scope.searchResults);
          if($scope.searchResults.users.length == 0) {
            $scope.errorMessageCustomerSearchResults = $scope.noEntriesError;
            $scope.errorCustomerSearchResults = true;
          }
          $scope.searchedCustomer = true;
          $scope.customerSearch = "";
          // console.log(data.data.data);
        })
    } else {
      $scope.errorMessageCustomerSearch = "Cannot Search when Name is empty";
      $scope.errorCustomerSearch = true;
      $scope.searchedCustomer = false;
    }
  }

  $scope.searchAllEmployee = function() {
    $scope.errorMessageEmployeeSearch = "";
    $scope.errorEmployeeSearch = false;
    $scope.errorMessageEmployeeSearchResults = "";
    $scope.errorEmployeeSearchResults = false;
    $scope.errorCustomerSearch = false;
    $scope.searchedCustomer = false;

    if ($scope.employeeSearch && $scope.employeeSearch.name != "") {
      $scope.errorMessageEmployeeSearchResults = "";
      $scope.errorEmployeeSearchResults = false;

      var query = {
        query: $scope.employeeSearch.name
      };

      ManagerService.searchAllEmployee(query)
        .then(function(data) {
          $scope.searchResults = data.data.data;
          if($scope.searchResults.employees.length == 0) {
            $scope.errorMessageEmployeeSearchResults = $scope.noEntriesError;
            $scope.errorEmployeeSearchResults = true;
          }
          console.log($scope.searchResults);
          $scope.searchedEmployee = true;
          $scope.employeeSearch = "";
        })
    } else {
        $scope.errorMessageEmployeeSearch = "Cannot Search when Name is empty";
        $scope.errorEmployeeSearch = true;
        $scope.searchedEmployee = false;
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
      if(employeeObj.ssn && employeeObj.ssn != "") {
        obj.ssn = employeeObj.ssn;
      }
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

  $scope.prepAddEmployee = function(userId) {
    $scope.storage.newEmployeeUserId = userId;
    $scope.employeeCreated = false;
    console.log("Prep add employee complete");
  }

  $scope.createEmployee = function(userId) {
    //console.log("clicked...");
    //console.log(userId);
    $scope.errorMessage = "";
    $scope.error = false;
    $scope.employeeCreated = false;

    var employeeObj = $scope.simplifyEmployeeObj($scope.createEmployee);
    if(employeeObj) {
      var obj = {
        employeeObj: employeeObj,
        userId: userId
      }
      ManagerService.createEmployee(obj)
        .then(function(data) {
          console.log(data.data.data.message);
          if($scope.createEmployee == null || $scope.createEmployee == undefined) {
            $scope.createEmployee = {};
          }
          $scope.employeeCreated = data.data.data.result;
        })
    } else {
      $scope.errorMessage = "Cannot Create Employee when fields are empty."
      $scope.error = true;
    }

    $scope.createEmployee.ssn = "";
    $scope.createEmployee.hourlyRate = "";
  }

  $scope.deleteEmployee = function(employeeId) {
    var obj = {
      employeeId: employeeId
    }
    ManagerService.deleteEmployee(obj)
      .then(function(data) {
        console.log(data);
        ManagerService.getBestEmployee()
          .then(function(data1) {
            $scope.storage.bestEmployee = data1.data.data;
          })
      })
  }

}]);
