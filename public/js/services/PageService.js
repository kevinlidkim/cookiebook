angular.module('PageServ', []).factory('PageService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

  var currentPage = null;

  return {

    loadPage : function(sendData) {
      return $http.post('/page', sendData)
        .success(function(data) {
          // console.log(data);
          currentPage = data;
          return currentPage;
        })
        .error(function(data) {
          // console.log(data);
          currentPage = null;
          return currentPage;
        })
    },

    getCurrentPage : function() {
      return currentPage;
    },

    postStatus : function(sendData) {
      return $http.post('/post', sendData)
        .success(function(data) {
        })
        .error(function(data) {
          return null;
        });
    },

    postComment : function(sendData) {
      return $http.post('/comment', sendData)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          // console.log(data);
          return null;
        });
    },

    getPersonalPageId : function() {
      return $http.get('/page/me')
        .success(function(data) {
          return data.data;
        })
        .error(function() {
          return null
        });
    },

    getFriendPageId : function(obj) {
      return $http.post('/page/friend', obj)
        .success(function(data) {
          return data.data;
        })
        .error(function() {
          return null;
        });
    },

    getGroupPageId : function(obj) {
      return $http.post('/page/group', obj)
        .success(function(data) {
          return data.data;
        })
        .error(function() {
          return null;
        });
    },

    loadGroupRequests : function(obj) {
      return $http.post('/page/groupRequests', obj)
        .success(function(data) {
          return data.data;
        })
        .error(function(data) {
          console.log(data);
        });
    },

    likesPost : function(sendData) {
      return $http.post('/likesPost', sendData)
        .success(function(data){
          // console.log(data);
        })
        .error(function(data) {
          //console.log(data);
          return null;
        });
    },

    likesComment : function(sendData) {
      return $http.post('/likesComment', sendData)
        .success(function(data){
          // console.log(data);
        })
        .error(function(data){
          //console.log(data);
          return null;
        });
    }

  }



}]);

