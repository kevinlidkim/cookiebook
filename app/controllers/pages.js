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
        var promiseArrayComments = [];
        _.forEach(values, function(post) {
          promiseArrayComments.push(db.CommentedOn.findAll({ where: {post: post.postId} }));
        })

        // Resolve the promise --> now we have the comment relations
        Promise.all(promiseArrayComments).then(commentRelations => {
          var flattenArray = [].concat.apply([], commentRelations);
          pageData.postCommentRelation = flattenArray;

          // Get all the comments
          var superPromiseArray = [];
          _.forEach(flattenArray, function(comment) {
            superPromiseArray.push(db.Comment.findAll({ where: {commentId: comment.comment} }))
          })

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

        })

      })


    })

}

// exports.loadPage = function(req, res) {

//   var pageData = {
//     page: req.body.page
//   }

//   var promiseArray = [];
//   var x = 0;
//   var y = 0;

//   // Find all posts on the page
//   db.PostedOn.findAll({ where: {page: req.body.page} })
//     .then(function(postRelation) {

//       // Get all the posts
//       var promiseArrayPosts = [];
//       _.forEach(postRelation, function(getPost) {
//         promiseArrayPosts.push(db.Post.find({ where: {postId: getPost.post} }));
//       })

//       // Resolve the promise --> now we have the posts
//       Promise.all(promiseArrayPosts).then(values => {
//         pageData.arrayOfPosts = values;

//         // Find all the comments for each post
//         var superPromise = _.forEach(values, function(post) {
//           // I THINK THIS PROMISE SCREWS EVERYTHING UP? THIS GETS THE RELATION TO FIND THE COMMENT
//           db.CommentedOn.findAll({ where: {post: post.postId} })
//             .then(function(commentRelation) {


//               console.log('wtf yo');

//               // Get all the comments
//               var promiseArrayComments = [];
//               _.forEach(commentRelation, function(getComment) {
//                 console.log('it doesnt even get in here');
//                 promiseArrayComments.push(db.Comment.find({ where: {commentId: getComment.comment} }));
//                 // promiseArray.push(db.Comment.find({ where: {commentId: getComment.comment} }));
//               })

//               superPromise['comment' + x] = promiseArrayComments;
//               x++;

//               return promiseArrayComments

//             })
//             // SHOULD PUT A THEN HERE AND DO SOMETHING TO GET THE STUFF CORRECTLY
//             .then(function(promiseChain) {
//               console.log('does it get here');
//               Promise.all(promiseChain).then(function (results) {
//                 superPromise['comments' + y] = results;
//                 console.log(superPromise['comments' + y]);
//               })
//             })
//         })

//         // console.log(superPromise);

//         // Resolve all promises --> now we have all the data we need
//         Promise.all(superPromise)
//         .then(function(stuff) {
//           console.log('this should print last?');
//           // console.log(stuff);
//           return res.status(200).json({
//             status: 'Retrieved all data',
//             pageData: pageData
//           })
//         })
//         .catch(function(err) {
//           return res.status(500).json({
//             status: 'Error retrieving all data'
//           })
//         })

//       })

//       // // Resolve all promises --> now we have all the data we need
//       // Promise.all(promiseArray)
//       // .then(function(stuff) {
//       //   console.log('uhhhh stuff?');
//       //   // console.log(stuff);
//       //   return res.status(200).json({
//       //     status: 'Retrieved all data',
//       //     pageData: pageData
//       //   })
//       // })
//       // .catch(function(err) {
//       //   return res.status(500).json({
//       //     status: 'Error retrieving all data'
//       //   })
//       // })

//     })

// }


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

// exports.findAll = function(req, res) {

//   db.Page.findAll()
//     .then(function (pages) {
//       res.status(200).json(pages);
//     })
//     .catch(function (err) {
//       res.status(500).json(err);
//     });
// }

// exports.show = function(req, res) {

//   db.Page.findById(req.params.id)
//     .then(function (page) {
//       res.status(200).json(page);
//     })
//     .catch(function (err) {
//       res.status(500).json(err);
//     });
// }

// exports.create = function(req, res) {

//   var page = db.Page.create(req.body)
//     .then(function (newPage) {
//       res.status(200).json(newPage);
//     })
//     .catch(function (err) {
//       res.status(500).json(err);
//     });
// }

// exports.update = function(req, res) {

//   db.Page.update(req.body, {
//     where: {
//       id: req.params.id
//     }
//   })
//     .then(function (updatedRecords) {
//       res.status(200).json(updatedRecords);
//     })
//     .catch(function (err) {
//       res.status(500).json(err);
//     });
// }

// exports.delete = function(req, res) {

//   db.Page.destroy({
//     where: {
//       id: req.params.id
//     }
//   })
//     .then(function (deletedRecords) {
//       res.status(200).json(deletedRecords);
//     })
//     .catch(function (err) {
//       res.status(500).json(err);
//     });
// }