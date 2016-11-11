var db = require('../../config/db');

exports.getPersonalPage = function(req, res) {

  db.OwnsPage.find({ where: {personId: req.personId} })
    .then(function(relation) {
      var pageId = relation.page;
      return db.Page.find({ where: {pageId: pageId} });
    })
    .then(function(personalPage) {
      var pageData;
      pageData.pageId = pageId;
      return db.PostedOn.find({ where: {page: pageId} });
    })
    .then(function(arrayOfPostRelation) {
      var arrayOfPostId = [];
      _.forEach(arrayOfPostRelation, function(getPostId) {
        var postId = getPostId.postId
        arrayOfPostId.push(return db.Post.find({ where: {postId: postId} }));
      })
      pageData.posts = arrayOfPostId;
      return pageData;
    });

    return res.status(200).json({
      status: 'Personal Page',
      data: pageData
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
}