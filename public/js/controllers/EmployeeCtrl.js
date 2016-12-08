angular.module('EmployeeCtrl', []).controller('EmployeeController', ['$scope', '$localStorage', '$sessionStorage', 'UserService', 'PageService', 'EmployeeService', function($scope, $localStorage, $sessionStorage, UserService, PageService, EmployeeService) {

  $scope.errorMessage = "";
  $scope.error = false;
  $scope.noEntriesError = "No matching entries exist.";
  $scope.errorMessageCustomerSearchResults = "";
  $scope.errorCustomerSearchResults = false;
  $scope.errorMessageCustomerSearch = "";
  $scope.errorCustomerSearch = false;
  $scope.searchedCustomer = false;
  $scope.customerCreated = false;

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
    $scope.errorMessageCustomerSearchResults = "";
    $scope.errorCustomerSearchResults = false;
    $scope.errorMessageCustomerSearch = "";
    $scope.errorCustomerSearch = false;

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

  $scope.simplifyPersonObj = function(personObj) {
    if (personObj != undefined) {
      var obj = {};
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

  $scope.simplifyUserObj = function(userObj) {
    if(userObj != undefined) {
      var obj = {}
      if(userObj.email && userObj.email != "") {
        obj.email = userObj.email;
      }
      if(userObj.password && userObj.password != "") {
        obj.password = userObj.password;
      }
      if(userObj.confirmPassword && userObj.confirmPassword != "") {
        obj.confirmPassword = userObj.confirmPassword;
      }
      if(userObj.adPreferences && userObj.adPreferences != "") {
        obj.adPreferences = userObj.adPreferences;
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

  $scope.updateCustomer = function() {
    //console.log($scope.storage.customerData);
    //console.log($scope.customerPerson);
    //console.log($scope.customerUser);
    var personObj = $scope.simplifyPersonObj($scope.customerPerson);
    var userObj = $scope.simplifyUserObj($scope.customerUser);
    var idObj = {
      userId: $scope.storage.customerData.userId,
      personId: $scope.storage.customerData.personId
    }

    if(userObj) {
      if($scope.customerUser.password == $scope.customerUser.confirmPassword) {
        $scope.error = false;
        var obj = {
          personObj: personObj,
          userObj: userObj,
          idObj: idObj
        }
        EmployeeService.updateCustomer(obj)
          .then(function(data) {
            $scope.storage.customerData = data.data.data;
          })

      } else {
        $scope.errorMessage = "Passwords do not match";
        $scope.error = true;
      }
      if($scope.customerPerson == null || $scope.customerPerson == undefined) {
        $scope.customerPerson = {};
      }
      if($scope.customerUser == null || $scope.customerUser == undefined) {
        $scope.customerUser = {};
      }
      $scope.customerPerson.firstName = "";
      $scope.customerPerson.lastName = "";
      $scope.customerPerson.address = "";
      $scope.customerPerson.city = "";
      $scope.customerPerson.state = "";
      $scope.customerPerson.zipCode = "";
      $scope.customerPerson.telephone = "";
      $scope.customerUser.email = "";
      $scope.customerUser.password = "";
      $scope.customerUser.confirmPassword = "";
      $scope.customerUser.adPreferences = "";
      $scope.customerPerson.creditCard = "";
    } else if(personObj) {
      $scope.error = false;
      var obj = {
        personObj: personObj,
        userObj: userObj,
        idObj: idObj
      }
      EmployeeService.updateCustomer(obj)
        .then(function(data) {
          if($scope.customerPerson == null || $scope.customerPerson == undefined) {
            $scope.customerPerson = {};
          }
          $scope.storage.customerData = data.data.data;
          $scope.customerPerson.firstName = "";
          $scope.customerPerson.lastName = "";
          $scope.customerPerson.address = "";
          $scope.customerPerson.city = "";
          $scope.customerPerson.state = "";
          $scope.customerPerson.zipCode = "";
          $scope.customerPerson.telephone = "";
          $scope.customerPerson.creditCard = "";
        })
    } else {
      $scope.errorMessage = "Cannot Update Data when fields are empty."
      $scope.error = true;
    }
  }

  $scope.createCustomer = function() {
    $scope.errorMessage = "";
    $scope.error = false;
    $scope.customerCreated = false;
    var personObj = $scope.simplifyPersonObj($scope.createCustomerPerson);
    var userObj = $scope.simplifyUserObj($scope.createCustomerUser);
    if (userObj && personObj) {
      var obj = {
        personObj: personObj,
        userObj: userObj
      }
      EmployeeService.createCustomer(obj)
        .then(function(data) {
          console.log(data.data.data.message);
          if($scope.customerPerson == null || $scope.customerPerson == undefined) {
            $scope.customerPerson = {};
          }
          if($scope.customerUser == null || $scope.customerUser == undefined) {
            $scope.customerUser = {};
          }
          $scope.customerCreated = data.data.data.result;
        })
    } else {
      $scope.errorMessage = "Cannot Create Customer when fields are empty."
      $scope.error = true;
    }
    $scope.createCustomerPerson.firstName = "";
    $scope.createCustomerPerson.lastName = "";
    $scope.createCustomerPerson.address = "";
    $scope.createCustomerPerson.city = "";
    $scope.createCustomerPerson.state = "";
    $scope.createCustomerPerson.zipCode = "";
    $scope.createCustomerPerson.telephone = "";
    $scope.createCustomerUser.email = "";
    $scope.createCustomerUser.password = "";
  }

}]);
