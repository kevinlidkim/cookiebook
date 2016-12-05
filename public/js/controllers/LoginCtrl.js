angular.module('LoginCtrl', []).controller('LoginController', ['$scope', '$localStorage', '$sessionStorage', '$location', 'UserService', 'PageService', function($scope, $localStorage, $sessionStorage, $location, UserService, PageService) {

  $scope.storage = $localStorage;

  $scope.login = function () {

    $scope.error = false;
    $scope.disabled = true;
    $scope.errorMessage = "";

    UserService.login($scope.loginForm)
      .then(function() {
        $scope.loadAll();
      })
      .then(function () {
        $location.path('/');
        $scope.disabled = false;
        $scope.loginForm = {};
      })
      .catch(function () {
        $scope.error = true;
        $scope.errorMessage = "Invalid username and/or password";
        $scope.disabled = false;
        $scope.loginForm = {};
      });

  };

  $scope.loadAll = function () {
    // Loads the user data
    var user = UserService.getUserData();
    if (user != null) {
      $scope.storage.user = user;
      $scope.storage.name = user.firstName + " " + user.lastName;
    }

    // Loads the user's friends
    var friendObj = {
      you: $scope.storage.user.userId
    }
    UserService.getFriendData(friendObj)
      .then(function(data) {
        $scope.storage.friendData = data.data;

        var groupObj = {
          you: $scope.storage.user.userId
        }

        // Loads the user's groups
        UserService.getGroupData(groupObj)
          .then(function(data) {
            $scope.storage.groupData = data.data.data;

            // Set up to load your personal page
            var userId = $scope.storage.user.userId;
            PageService.getPersonalPageId(userId)
              .then(function(pageId) {
                $scope.storage.personalPageId = pageId.data.data;

                var data = {
                  page: $scope.storage.personalPageId,
                  user: $scope.storage.user.userId
                }

                // Load your personal page
                PageService.loadPage(data)
                  .then(function(pageData) {
                    $scope.storage.page = pageData;



                    // Load your messages
                    var obj = $scope.storage.user;
                    UserService.loadMessages(obj)
                      .then(function(data) {
                        $scope.storage.listOfMessages = data.data.data;

                        // Load employee status
                        if ($scope.storage.user) {
                          var employee = {
                            userId: $scope.storage.user.userId
                          }
                          UserService.isEmployee(employee)
                            .then(function(status) {
                              $scope.storage.isEmployee = status.data.data;
                              $scope.storage.employee = status.data.employee;

                              // Loads bank accounts
                              var bankObj = {
                                owner: $scope.storage.user.userId
                              }
                              UserService.loadBankAccounts(bankObj)
                                .then(function(data) {
                                  $scope.storage.user.bankAccounts = data.data.data.accounts;

                                  // Load manager status
                                  var manager = {
                                    userId: $scope.storage.user.userId
                                  }
                                  UserService.isManager(manager)
                                    .then(function(admin) {
                                      $scope.storage.isManager = admin.data.data;
                                      $scope.storage.manager = admin.data.manager;
                                    })
                                })
                            })
                        }
                      })
                  })
              })


          })

      })
  }
  
}]);

