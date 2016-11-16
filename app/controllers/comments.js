var db = require('../../config/db');

exports.findAll = function(req, res) {

  db.Comment.findAll()
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.makeComment = function(req, res) {

  // need to increase comment count of post by 1

  db.Comment.create(req.body)
    .then(function(comment) {
      var relation = {
        post: req.body.post,
        user: req.body.user,
        comment: comment.commentId,
        dateTimePosted: new Date()
      };
      return db.CommentedOn.create(relation);
    })
    .then(function(newRelation) {
      return res.status(200).json({
        status: 'Successfully created comment',
        data: newRelation
      });
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Error commenting'
      });
    });
}



// exports.findAll = function(req, res) {

//   db.Comment.findAll()
//     .then(function (comments) {
//       res.status(200).json(comments);
//     })
//     .catch(function (err) {
//       res.status(500).json(err);
//     });
// }

// exports.show = function(req, res) {

//   db.Comment.findById(req.params.id)
//     .then(function (comment) {
//       res.status(200).json(comment);
//     })
//     .catch(function (err) {
//       res.status(500).json(err);
//     });
// }

// exports.create = function(req, res) {

//   var comment = db.Comment.create(req.body)
//     .then(function (newComment) {
//       res.status(200).json(newComment);
//     })
//     .catch(function (err) {
//       res.status(500).json(err);
//     });
// }

// exports.update = function(req, res) {

//   db.Comment.update(req.body, {
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

//   db.Comment.destroy({
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