var db = require('../../config/db');
var _ = require('lodash');

exports.findAll = function(req, res) {

  db.Page.findAll()
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.findAll2 = function(req, res) {

  db.OwnsPage.findAll()
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.loadPage = function(req, res) {

  var pageData = {
    page: req.body.page
  }

  // Find all posts on the page
  db.PostedOn.findAll({ where: {page: req.body.page} })
    .then(function(postRelation) {

      // Get all the posts
      var promiseArrayPosts = [];
      _.forEach(postRelation, function(getPost) {
        promiseArrayPosts.push(db.Post.find({ where: {postId: getPost.post} }));
      })

      // Resolve the promise --> now we have the posts
      Promise.all(promiseArrayPosts).then(values => {
        pageData.arrayOfPosts = values;

        // Get all the comment relations
        // Get all the likesPost relations
        var promiseArrayComments = [];
        var promistArrayLikesPost = [];
        _.forEach(values, function(post) {
          promiseArrayComments.push(db.CommentedOn.findAll({ where: {post: post.postId} }));
          promistArrayLikesPost.push(db.LikesPost.findAll({where: {post: post.postId}}))
        })

        // Resolve the promise --> now we have the likesPost relations
        Promise.all(promistArrayLikesPost).then(likesPostRelations => {
          var LikesPostRelations = [].concat.apply([], likesPostRelations);
          pageData.arrayOfLikesPost = LikesPostRelations;

        // Resolve the promise --> now we have the comment relations
        Promise.all(promiseArrayComments).then(commentRelations => {
          var flattenArray = [].concat.apply([], commentRelations);
          pageData.postCommentRelation = flattenArray;

          // Get all the comments
          var superPromiseArray = [];
          var promistArrayLikesComment = [];
          _.forEach(flattenArray, function(comment) {
            superPromiseArray.push(db.Comment.findAll({ where: {commentId: comment.comment} }));
            promistArrayLikesComment.push(db.LikesComment.findAll({where: {comment : comment.comment}}))
          })

          // Resolve the promise --> now we have the likesComment relations
          Promise.all(promistArrayLikesComment).then(likesCommentRelations => {
            var LikesCommentRelations = [].concat.apply([], likesCommentRelations);
            pageData.arrayOfLikesComment = LikesCommentRelations;

            // Resolve the promise --> now we have all the comments
            Promise.all(superPromiseArray).then(arrayOfComments => {
              var flattenComments = [].concat.apply([], arrayOfComments);
              pageData.arrayOfComments = flattenComments;
            })

          .then(function() {

            // Convert arrays to maps
            var comments = _.keyBy(pageData.arrayOfComments, 'commentId');
            var posts = _.keyBy(pageData.arrayOfPosts, 'postId');

            var arrayFinalData = [];
            _.forEach(posts, function(post) {
              var result = {
                postId: post.postId,
                content: post.content,
                likes: post.likes,
                commentCount: post.commentCount,
                comments: []
              }
              arrayFinalData.push(result);
            })

            // finalData is where we get all posts and comments
            var finalData = _.keyBy(arrayFinalData, 'postId');

            // Add all the comments into finalData
            _.forEach(pageData.postCommentRelation, function(relation) {
              var postId = relation.post;
              finalData[postId].comments.push(comments[relation.comment]);
            })

            return res.status(200).json({
              status: "Retrieved all comments successfully",
              pageData: pageData,
              finalData: finalData
            });
          })
          .catch(function(err) {
            console.log(err);
            return res.status(500).json({
              status: "Error retrieving all comments"
            });
          })

          }) //promise likesComment Relation

        })  //promise comment relation
        })  //promist likesPost

      }) //promise post
    })



}


exports.getPersonalPageId = function(req, res) {

  db.OwnsPage.find({ where: {owner: req.user.userId} })
    .then(function(relation) {
      var pageId = relation.page;
      return res.status(200).json({
        status: 'Personal Page Id',
        data: pageId
      });
    })
    .catch(function(err) {
      return res.status(500).json({
        status: 'Error retrieving personal page'
      });
    });
}

exports.getFriendPageId = function(req, res) {

  db.OwnsPage.find({ where: {owner: req.body.id} })
    .then(function(relation) {
      var pageId = relation.page;
      return res.status(200).json({
        status: 'Friend Page Id',
        data: pageId
      });
    })
    .catch(function(err) {
      return res.status(500).json({
        status: 'Error retrieving friend page'
      });
    });
}

exports.getGroupPageId = function(req, res) {

  db.OwnsPage.find({ where: {group: req.body.id} })
    .then(function(relation) {
      var pageId = relation.page;
      return res.status(200).json({
        status: 'Group Page Id',
        data: pageId
      });
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Error retrieving group page'
      });
    });
}

exports.loadAds = function(req, res) {

  var data = {};

  if (req.body.user.adPreferences == null || req.body.user.adPreferences == "") {
    db.Advertisement.findAll()
      .then(function(ads) {
        data.ads = ads;
      })
      .then(function() {
        return res.status(200).json({
          status: 'Loaded all ads',
          data: data.ads
        })
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({
          status: 'Failed to load all ads'
        })
      })

  } else {
    db.Advertisement.findAll({ where: {adType: {$like: '%' + req.body.user.adPreferences + '%'} } })
      .then(function(ads) {
        data.ads = ads;
      })
      .then(function() {
        return res.status(200).json({
          status: 'Loaded preferred ads',
          data: data.ads
        })
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({
          status: 'Failed to load preferred ads'
        })
      })
  }
}