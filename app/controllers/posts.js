var db = require('../../config/db');

exports.findAll = function(req, res) {

  db.Post.findAll()
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.findAll2 = function(req, res) {

  db.PostedOn.findAll()
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.makePost = function(req, res) {

  db.Post.create(req.body)
    .then(function(post) {

      var date = new Date();
      var relation = {
        post: post.postId,
        page: req.body.page,
        user: req.body.user,
        dateTimePosted: new Date()
      };

      return db.PostedOn.create(relation);
    })
    .then(function(newRelation) {

      //INCREASE COMMENT COUNT.
      db.Page.find({
        where: {
          pageId: newRelation.page,
        }
      }).then(function(page){
        var newPostCount = page.postCount + 1;

        db.Page.update({postCount: newPostCount}, {
          where: {
            pageId: newRelation.page,
          }
        }).then(function(data) {

          console.log("Successfully increased post Count in pageId: " + newRelation.page);

        })
      })
    //INCREASE COMMENT COUNT.

      return res.status(200).json({
        status: 'Successfully created post',
        data: newRelation
      });
    })
    .catch(function(err) {
      return res.status(500).json({
        status: 'Error posting'
      });
    });

}

// exports.findAll = function(req, res) {

//   db.Post.findAll()
//     .then(function (posts) {
//       res.status(200).json(posts);
//     })
//     .catch(function (err) {
//       res.status(500).json(err);
//     });
// }

// exports.show = function(req, res) {

//   db.Post.findById(req.params.id)
//     .then(function (post) {
//       res.status(200).json(post);
//     })
//     .catch(function (err) {
//       res.status(500).json(err);
//     });
// }

// exports.create = function(req, res) {

//   var post = db.Post.create(req.body)
//     .then(function (newPost) {
//       res.status(200).json(newPost);
//     })
//     .catch(function (err) {
//       res.status(500).json(err);
//     });
// }

// exports.update = function(req, res) {

//   db.Post.update(req.body, {
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

//   db.Post.destroy({
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