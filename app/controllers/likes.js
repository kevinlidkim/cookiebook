var db = require('../../config/db');

exports.findAll = function(req, res) {

  db.LikesComment.findAll()
  .then(function(){
    db.LikesPost.findAll();
  })
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.LikesPost = function(req, res) {

  db.LikesPost.find({
      where: {
        post: req.body.post,
        user: req.body.user
      }
    })
    .then(function(relation){
      if(relation == null) {
        var relation = {
          post: req.body.post,
          user: req.body.user
        };

        db.Post.find({
          where: {
            postId: req.body.post
          }
        }).then(function(post){
          var newLike = post.likes + 1;

            db.Post.update({likes: newLike}, {where: {postId: req.body.post}})
            .then(function(data) {

              //console.log("Successfully increased like Count in PostId: " + req.body.post);

            })
        })

        return db.LikesPost.create(relation);
      } else {
        relation.destroy();

          db.Post.find({
            where: {
              postId: req.body.post
            }
          }).then(function(post){
            var newLike = post.likes - 1;

              db.Post.update({likes: newLike}, {where: {postId: req.body.post}})
              .then(function(data) {

                //console.log("Successfully decreased like Count in PostId: " + req.body.post);

              })
          })

        return null;
      }

    })
    .then(function(newRelation){
      if(newRelation != null){
        return res.status(200).json({
        status: "Successfully created LikesPost",
        data: newRelation
        });
      } else {
        return res.status(200).json({
        status: "Successfully deleted LikesPost",
        data: newRelation
        });
      }
      
    })
    .catch(function(err){
      console.log(err);
      return res.status(500).json({
        status: "Error Liking/unliking Post"
      });
    })
}

exports.LikesComment = function(req, res) {

  db.LikesComment.find({
    where: {
      comment: req.body.comment,
      user: req.body.user
    }
  })
  .then(function(relation){
    if(relation == null) {
        var relation = {
          comment: req.body.comment,
          user: req.body.user
        };

        db.Comment.find({
          where: {
            commentId: req.body.comment
          }
        }).then(function(comment){
          var newLike = comment.likes + 1;

            db.Comment.update({likes: newLike}, {where: {commentId: req.body.comment}})
            .then(function(data) {
              //console.log("Successfully increased like Count in comment: " + req.body.comment);

            })
        })

        return db.LikesComment.create(relation);
      } else {
        relation.destroy();

        db.Comment.find({
          where: {
            commentId: req.body.comment
          }
        }).then(function(comment){
          var newLike = comment.likes - 1;

            db.Comment.update({likes: newLike}, {where: {commentId: req.body.comment}})
            .then(function(data) {
              //console.log("Successfully decreased like Count in comment: " + req.body.comment);

            })
        })

        return null;
      }
  })
  .then(function(newRelation){
      if(newRelation != null){
        return res.status(200).json({
        status: "Successfully created LikesComment",
        data: newRelation
        });
      } else {
        return res.status(200).json({
        status: "Successfully deleted LikesComment",
        data: newRelation
        });
      }
      
    })
    .catch(function(err){
      console.log(err);
      return res.status(500).json({
        status: "Error Liking/unliking Comment"
      });
    })
}
