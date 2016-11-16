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

// exports.loadPage = function(req, res) {

//   var pageData = {
//     page: req.body.page
//   }
//   db.PostedOn.findAll({ where: {page: req.body.page} })
//     .then(function(relation) {

//       var promiseArray = [];
//       _.forEach(relation, function(getPost) {
//         promiseArray.push(db.Post.find({ where: {postId: getPost.post} }));
//       })

//       Promise.all(promiseArray).then(values => {
//         pageData.arrayOfPosts = values;
//         return res.status(200).json({
//           status: 'Successfully retrieved all posts',
//           pageData: pageData
//         })
//       })
//       .catch(function(err) {
//         return res.status(500).json({
//           status: 'Error retireving posts'
//         })
//       });
//     })

// }

exports.loadPage = function(req, res) {

  var pageData = {
    page: req.body.page
  }

  // Find all posts on the page
  db.PostedOn.findAll({ where: {page: req.body.page} })
    .then(function(postRelation) {

      var promiseArray = [];

      // Get all the posts
      var promiseArrayPosts = [];
      _.forEach(postRelation, function(getPost) {
        promiseArrayPosts.push(db.Post.find({ where: {postId: getPost.post} }));
      })

      // Resolve the promise --> now we have the posts
      Promise.all(promiseArrayPosts).then(values => {
        pageData.arrayOfPosts = values;

        // Find all the comments for each post
        _.forEach(values, function(post) {
          db.CommentedOn.findAll({ where: {post: values.postId} })
            .then(function(commentRelation) {

              // Get all the comments
              var promiseArrayComments = [];
              _.forEach(commentRelation, function(getComment) {
                promiseArrayComments.push(db.Post.find({ where: {commentId: getComment.comment} }));
              })

              // Resolve the promise --> now we have all comments for that post
              Promise.all(promiseArrayComments).then(values2 => {
                promiseArray.push(values2);
                console.log('yoooooo');
              })

            })       
        })


      })

      // Resolve all promises --> now we have all the data we need
      Promise.all(promiseArray).then(allData => {
        var x = 0;
        _.forEach(allData, function(arrayOfData) {
          pageData.arrayOfPosts[x].comments = arrayOfData;
          console.log(x);
          x++;
        })
        return pageData;
      })
      .then(function(stuff) {
        return res.status(200).json({
          status: 'Retrieved all data',
          pageData: pageData
        })
      })
      .catch(function(err) {
        return res.status(500).json({
          status: 'Error retrieving all data'
        })
      })

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