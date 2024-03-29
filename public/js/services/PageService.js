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

    updateStatus : function(sendData) {
      return $http.post('/updatePost', sendData)
        .success(function(data) {
        })
        .error(function(data) {
          return null;
        });
    },

    updateComment : function(sendData) {
      return $http.post('/updateComment', sendData)
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

    updateGroup : function(obj) {
      return $http.post('/group/update', obj)
        .success(function(data) {
          // console.log(data);
          return data.data;
        })
        .error(function(data) {
          console.log(data);
        })
    },

    loadGroupMembers: function(obj) {
      return $http.post('/group/loadMembers', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
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
    },

    deleteComment: function(sendData) {
      return $http.post('/deleteComment', sendData)
        .success(function(data){
        })
        .error(function(data){
        })

    },

    deletePost: function(sendData) {
      return $http.post('/deletePost', sendData)
        .success(function() {
        })
        .error(function(data) {
        })
    },

    commentedBy : function(sendData) {
      return $http.post('/commentedBy', sendData)
        .success(function(data){
           //console.log(data);
        })
        .error(function(data){
            //console.log(data);
          return null;
        });
    },

    postedBy: function(sendData) {
      return $http.post('/postedBy', sendData)
        .success(function(data){
           //console.log(data);
        })
        .error(function(data){
            console.log(data);
          return null;
        });
    },

    loadAds : function(obj) {
      return $http.post('/loadAds', obj)
        .success(function(data) {
          // console.log(data);
        })
        .error(function(data) {
          console.log(data);
        })
    }

  }



}]);
