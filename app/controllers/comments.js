var db = require('../../config/db');
var _ = require('lodash');

exports.findAll = function(req, res) {

  db.Comment.findAll()
  .then(function (users) {
    res.status(200).json(users);
  })
  .catch(function (err) {
    res.status(500).json(err);
  });
}

exports.findAll2 = function(req, res) {

  db.CommentedOn.findAll()
  .then(function (users) {
    res.status(200).json(users);
  })
  .catch(function (err) {
    res.status(500).json(err);
  });
}

exports.makeComment = function(req, res) {
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

    //INCREASE COMMENT COUNT.
    db.Post.find({
      where: {
        postId: req.body.post,
      }
    }).then(function(post){
      var newCommentCount = post.commentCount + 1;

      db.Post.update({commentCount: newCommentCount}, {
        where: {
          postId: req.body.post,
        }
      }).then(function(data) {

        //console.log("Successfully increased comment Count in PostId: " + req.body.post);

      })
    })
    //INCREASE COMMENT COUNT.

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

exports.updateComment = function(req, res) {

  db.Comment.update({content: req.body.content}, {
    where: {
      commentId: req.body.comment
    }
  })
  .then(function(){
   return res.status(200).json({
    status: 'Successfully updated post',
  });
 })
  .catch(function(err) {
    return res.status(500).json({
      status: 'Error posting'
    });
  })
}

exports.deleteComment = function(req, res) {
    //DECREASE POST COMMENT COUNT.
    db.CommentedOn.find({
      where: {
        comment: req.body.comment,
      }
    })
    .then(function(commentedOn) {

      console.log("commentId: " + commentedOn.comment);

      db.Comment.find({
        where: {
          commentId: commentedOn.comment
        }
      })
      .then(function(comment) {

        db.Post.find({
          where: {
            postId: commentedOn.post,
          }
        })
        .then(function(post){
          var newCommentCount = post.commentCount - 1;

          db.LikesComment.find({
            where: {
              comment: commentedOn.comment,
            }
          })
          .then(function(LikesComment) {
            db.Post.update({commentCount: newCommentCount}, {
              where: {
                postId: commentedOn.post
              }
            }).then(function(data) {

              commentedOn.destroy();
              console.log("Deleted commentedOn relation.");

              if(LikesComment != null){

                  LikesComment.destroy();                         ///CHECK THESE FOR NULL BEFORE DELETEING 
                  console.log("delted LikesComment relation");

                }

                comment.destroy();
                console.log("DELETED COMMENT");
                console.log("Successfully decreased comment Count in PostId: " + req.body.post);

              })
          })
        })
      })

      return res.status(200).json({
        status: 'Successfully deleted comment',
      });

    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Error deleting comment'
      });
    });
  }

  exports.commentedBy = function(req, res) {

    var data = {};
    var promiseArrayRelations = [];
    var promiseArray = [];
    var commentedByArray = [];

    db.CommentedOn.findAll({where: {post : req.body.post}})
    .then(function(relation){

      _.forEach(relation, function(relation) {
        promiseArrayRelations[relation.comment] = relation.user;
        promiseArray.push(db.User.find({ where: {userId: relation.user} }));
      })  

      Promise.all(promiseArrayRelations).then(values1 => {
        data.arrayCommentedOn = values1;

        Promise.all(promiseArray).then(values => {
          _.forEach(values, function(values){
            commentedByArray.push(db.Person.find({where: {personId: values.personId}}))
          })

          Promise.all(commentedByArray).then(commentedByArray=> {
            data.arrayCommentedBy = commentedByArray;
          })
          .then(function(){
            return res.status(200).json({
              status: 'Successfully found Person commentedBy array',
              data: data

            });
          })
          .catch(function(err) {
            console.log(err);
            return res.status(500).json({
              status: 'Error finding Person commentedBy array'
            });
          });
        })
      })
    })
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