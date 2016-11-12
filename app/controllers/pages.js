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

// exports.getPersonalPage = function(req, res) {

//   db.OwnsPage.find({ where: {personId: req.personId} })
//     .then(function(relation) {
//       var pageId = relation.page;
//       return db.Page.find({ where: {pageId: pageId} });
//     })
//     .then(function(personalPage) {
//       var pageData;
//       pageData.pageId = pageId;
//       return db.PostedOn.find({ where: {page: pageId} });
//     })
//     .then(function(arrayOfPostRelation) {
//       var arrayOfPostId = [];
//       _.forEach(arrayOfPostRelation, function(getPostId) {
//         var postId = getPostId.postId
//         // SHOULDNT I RETURN THE dbPost.find? ISNT IT A PROMISE?
//         arrayOfPostId.push(db.Post.find({ where: {postId: postId} }));
//       });
//       pageData.posts = arrayOfPostId;
//       return pageData;
//     });

//     console.log('yooooooooo');
//     console.log(pageData);

//     return res.status(200).json({
//       status: 'Personal Page',
//       data: pageData
//     });
// }

exports.loadPage = function(req, res) {

  var pageData = {
    page: req.body.page
  }
  db.PostedOn.findAll({ where: {page: req.body.page} })
    .then(function(relation) {

      var promiseArray = [];
      _.forEach(relation, function(getPost) {
        promiseArray.push(db.Post.find({ where: {postId: getPost.post} }));
      })

      Promise.all(promiseArray).then(values => {
        pageData.arrayOfPosts = values;
        return res.status(200).json({
          status: 'Successfully retrieved all posts',
          pageData: pageData
        })
      })
      .catch(function(err) {
        return res.status(500).json({
          status: 'Error retireving posts'
        })
      });
    })

}

// exports.loadPage = function(req, res) {

//   var pageData = {
//     page: req.body.page
//   }
//   db.PostedOn.findAll({ where: {page: req.body.page} })
//     .then(function(relation) {

//       var newArray = [];
//       var array = _.forEach(relation, function(getPost) {
//         return db.Post.find({ where: {postId: getPost.post} })
//           .then(function(post) {
//             newArray.push(post);
//             console.log('correct content');
//             console.log(post.content);
//           })
//       })

//       console.log(newArray);
//       console.log('asdasdasdjoasfhioejrowejirowejiorewo');
//       return array;

//     })
//     .then(function(arrayOfPosts) {

//       pageData.arrayOfPosts = arrayOfPosts;

//       return res.status(200).json({
//         status: 'Successfully retrieved all posts',
//         pageData: pageData
//       });
//     })
//     .catch(function(err) {
//       console.log(err);
//       return res.status(500).json({
//         status: 'There was an error retrieving all the posts'
//       });
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