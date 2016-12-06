var db = require('../../config/db');
var _ = require('lodash');

exports.createGroup = function(req, res) {

  var groupObj = {
    groupName: req.body.groupName,
    type: req.body.type
  }

  var groupsRelation = {
    owner: req.body.you,
    user: req.body.you
  };

  db.Group.create(groupObj)
    .then(function(group) {
      groupsRelation.group = group.groupId;
      return db.OwnsGroup.create(groupsRelation);
    })
    .then(function() {
      return db.MemberOfGroup.create(groupsRelation);
    })
    .then(function() {
      var newPage = {
        postCount: 0
      }
      return db.Page.create(newPage)
    })
    .then(function(page) {
      var relation = {
        page: page.pageId,
        group: groupsRelation.group
      }
      return db.OwnsPage.create(relation);
    })
    .then(function(result) {
      return res.status(200).json({
        status: 'Successfully created group',
        pageId: result.page,
        groupId: groupsRelation.group
      })
    })
    .catch(function(err) {
      // console.log(err);
      return res.status(500).json({
        status: 'Error creating group'
      })
    })

}

exports.updateGroup = function(req, res) {
    var obj = {};

    if (req.body.groupObj) {
      db.Group.update(req.body.groupObj, {
        where : {
          groupId : req.body.groupId
        }
      })
      .then(function() {
        return db.Group.find({ where: {groupId: req.body.groupId} })
      })
      .then(function(group) {
        obj.groupName = group.groupName;
        obj.type = group.type;
        obj.groupId = group.groupId;
        return res.status(200).json({
          data: obj,
          status: 'Update group successful'
        })
      })
      .catch(function(err) {
        return res.status(500).json({
          status: 'Error updating group'
        })
      })
    }
}

exports.deleteGroup = function(req, res) {

  var data = {};

  // Get the page object
  db.OwnsPage.find({ where: {group: req.body.groupId} })
    .then(function(ownsPageToDelete) {
      data.ownsPageToDelete = ownsPageToDelete;
      return db.Page.find({ where: {pageId: ownsPageToDelete.page} })
    })
    .then(function(pageToDelete) {
      data.pageToDelete = pageToDelete;

      // Get all the post relations on the page
      return db.PostedOn.findAll({ where: {page: pageToDelete.pageId} })
    })
    .then(function(postedOnToDelete) {
      data.postedOnToDelete = postedOnToDelete;

      // Get all posts from the relation;
      var promiseArrayPosts = [];
      _.forEach(postedOnToDelete, function(obj) {
        promiseArrayPosts.push(db.Post.find({ where: {postId: obj.post} }));
      })
      Promise.all(promiseArrayPosts).then(values => {
        data.postsToDelete = values;

        // Get all the comment and like relations from the posts
        var promiseArrayComments = [];
        var promiseArrayLikesPost = [];
        _.forEach(values, function(post) {
          promiseArrayComments.push(db.CommentedOn.findAll({ where: {post: post.postId} }));
          promiseArrayLikesPost.push(db.LikesPost.findAll({ where: {post: post.postId} }));
        })

        Promise.all(promiseArrayLikesPost).then(values1 => {
          var likesPostToDelete = [].concat.apply([], values1);
          data.likesPostToDelete = likesPostToDelete;

          Promise.all(promiseArrayComments).then(values2 => {
            var commentRelationsToDelete = [].concat.apply([], values2);
            data.commentRelationsToDelete = commentRelationsToDelete;

            // Get all the comments and like relations from the comments
            var promiseArrayAllComments = [];
            var promiseArrayLikesComments = [];
            _.forEach(commentRelationsToDelete, function(comment) {
              promiseArrayAllComments.push(db.Comment.findAll({ where: {commentId: comment.comment} }));
              promiseArrayLikesComments.push(db.LikesComment.findAll({ where: {comment: comment.comment} }))
            })

            Promise.all(promiseArrayLikesComments).then(values3 => {
              var commentLikesToDelete = [].concat.apply([], values3);
              data.commentLikesToDelete = commentLikesToDelete;

              Promise.all(promiseArrayAllComments).then(values4 => {
                var commentsToDelete = [].concat.apply([], values4);
                data.commentsToDelete = commentsToDelete;
              })
              .then(function() {

                // Now that we have all the page information, we can delete everything on the page

                // Delete each like relation for comments
                _.forEach(data.CommentLikesToDelete, function(deleteCommentLike) {
                  return db.LikesComment.destroy({ where: {comment: deleteCommentLike.comment} });
                })

                // Delete each commented on relation
                _.forEach(data.commentRelationsToDelete, function(deleteCommentRelation) {
                  return db.CommentedOn.destroy({ where: {comment: deleteCommentRelation.comment} });
                })

                // Delete each comment
                _.forEach(data.commentsToDelete, function(deleteComment) {
                  return db.Comment.destroy({ where: {commentId: deleteComment.commentId} });
                })

                // Delete each like relation for posts
                _.forEach(data.likesPostToDelete, function(deletePostLike) {
                  return db.LikesPost.destroy({ where: {post: deletePostLike.post} });
                })

                // Delete each posted on relation
                _.forEach(data.postedOnToDelete, function(deletePostedOn) {
                  return db.PostedOn.destroy({ where: {post: deletePostedOn.post} });
                })

                // Delete each post
                _.forEach(data.postsToDelete, function(deletePost) {
                  return db.Post.destroy({ where: {postId: deletePost.postId} });
                })

                // Delete the owns page relation
                return db.OwnsPage.destroy({ where: {page: data.ownsPageToDelete.page} });

              })
              .then(function() {
                // Delete the page
                return db.Page.destroy({ where: {pageId: data.pageToDelete.pageId} });
              })
              .then(function() {
                // Delete all group requests sent to other users
                return db.SendGroupRequest.destroy({ where: {group: req.body.groupId} });
              })
              .then(function() {
                // Delete all the group requests received from other users
                return db.JoinGroupRequest.destroy({ where: {group: req.body.groupId} });
              })
              .then(function() {
                // Delete all the member of group relations
                return db.MemberOfGroup.destroy({ where: {group: req.body.groupId} });
              })
              .then(function() {
                // Delete the owner of the group relation
                return db.OwnsGroup.destroy({ where: {group: req.body.groupId} });
              })
              .then(function() {
                // Delete the group
                return db.Group.destroy({ where: {groupId: req.body.groupId} });
              })
              .then(function() {
                return res.status(200).json({
                  status: 'Successfully deleted group'
                })
              })
              .catch(function(err) {
                console.log(err);
                return res.status(500).json({
                  status: 'Failed to delete group'
                })
              })
            })
          })
        })

      })

    })
}


exports.getGroupData = function(req, res) {

  var data = {};

  db.OwnsGroup.findAll({ where: {owner: req.body.you} })
    .then(function(ownsGroup) {

      var promiseArrayOwnsGroup = [];
      _.forEach(ownsGroup, function(getGroup) {
        promiseArrayOwnsGroup.push(db.Group.find({ where: {groupId: getGroup.group} }));
      })

      Promise.all(promiseArrayOwnsGroup).then(values => {
        data.ownsGroup = values;
      })

      .then(function() {
        return db.MemberOfGroup.findAll({ where: {user: req.body.you} })
      })
      .then(function(memberOfGroup) {

        var promiseArrayMemberGroup = [];
        _.forEach(memberOfGroup, function(member) {
          promiseArrayMemberGroup.push(db.Group.find({ where: {groupId: member.group} }));
        })

        Promise.all(promiseArrayMemberGroup).then(groups => {
          data.allGroup = groups;
          data.memberOfGroup = _.differenceWith(data.allGroup, data.ownsGroup, _.isEqual);
        })
        .then(function() {

          var superPromiseArray = [];
          for (var i = 0; i < data.ownsGroup.length; i++) {
            superPromiseArray.push(db.JoinGroupRequest.findAll({ where: {group: data.ownsGroup[i].groupId} }));
          }

          Promise.all(superPromiseArray).then(results => {
            var flattenRequests = [].concat.apply([], results);
            data.JoinRequests = flattenRequests;
            // need to get user and then person so you can display => person name wants to join group name

          })
          .then(function() {
              // get all the sendgrouprequest with your user
              return db.SendGroupRequest.findAll({ where: {user: req.body.you} })
          })
          .then(function(sendGroupRequest) {
              // load all received group requests into a list
              var sendGroupRequestArray = [];
              //console.log(sendGroupRequest);

              _.forEach(sendGroupRequest, function(sendGroupRequest) {
                  sendGroupRequestArray.push(db.Group.find({ where: {groupId: sendGroupRequest.group} }));
              })
              Promise.all(sendGroupRequestArray).then(values => {
                  data.sendGroupRequest = values;
                  //console.log(values)
              })
              .then(function() {
                return res.status(200).json({
                  status: 'Successfully retrieve groups',
                  data: data
                })
              })
              .catch(function(err) {
                console.log(err)
                return res.status(500).json({
                  status: 'Failed to retrieve groups'
                })
              })

            }

          )
        })
      })

    })

}


exports.joinGroupRequest = function(req, res) {

  db.MemberOfGroup.find({ where: {user: req.body.you, group: req.body.group} })
    .then(function(groupMember) {

      if (groupMember == null) {
        db.JoinGroupRequest.find({ where: {user: req.body.you, group: req.body.group} })
          .then(function(joinRequest) {

            if (joinRequest == null) {
              var newRequest = {
                user: req.body.you,
                group: req.body.group
              }
              db.JoinGroupRequest.create(newRequest)
                .then(function() {
                  return res.status(200).json({
                    status: 'Join group request send'
                  })
                })
                .catch(function(err) {
                  return res.status(500).json({
                    status: 'Error sending join group request'
                  })
                })

            } else {
              return res.status(200).json({
                status: 'Already sent join group request'
              })
            }
          })


      } else {
        return res.status(200).json({
          status: 'Already in the group'
        })
      }
    })

}

exports.sendGroupRequest = function(req, res) {

    db.MemberOfGroup.find({ where: {user: req.body.user, group: req.body.group} })
      .then(function(groupMember) {

        if(groupMember == null) {
          db.SendGroupRequest.find({ where: {user: req.body.user, group: req.body.group} })
            .then(function(sendRequest) {
              if(sendRequest == null) {
                var newRequest = {
                  user: req.body.user,
                  group: req.body.group
                }
                db.SendGroupRequest.create(newRequest)
                  .then(function() {
                    return res.status(200).json({
                      status: 'Join group request send'
                    })
                  })
                  .catch(function(err) {
                    return res.status(500).json({
                      status: 'Error sending join group request'
                    })
                  })
              } else {
                return res.status(200).json({
                  status: 'Already sent send group request'
                })
              }
            })
        } else {
            return res.status(200).json({
              status: 'Already in the group'
            })
        }
      })
}

exports.approveGroupRequest = function(req, res) {

  db.JoinGroupRequest.find({ where: {user: req.body.user, group: req.body.group} })
    .then(function(joinRequest) {
      return joinRequest.destroy();
    })
    .then(function() {
      return db.MemberOfGroup.create(req.body);
    })
    .then (function() {
      return res.status(200).json({
        status: 'Approved user to group'
      })
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Failed to approve user join group request'
      })
    })
}

exports.loadGroupRequest = function(req, res) {

  var data = {};

  db.JoinGroupRequest.findAll({ where: {group: req.body.group} })
    .then(function(joinRequests) {

      var userPromiseArray = [];
      _.forEach(joinRequests, function(user) {
        // console.log(user.user);
        userPromiseArray.push(db.User.find({ where: {userId: user.user} }));
      })

      Promise.all(userPromiseArray).then(values => {
        data.users = values;

        var personPromiseArray = [];
        // _.forEach(data.users, function(person) {
        //   personPromiseArray.push(db.Person.find({ where: {personId: person.personId} }));
        // })
        for (var i = 0; i < data.users.length; i++) {
          personPromiseArray.push(db.Person.find({ where: {personId: data.users[i].personId} }));
        }

        Promise.all(personPromiseArray).then(results => {
          data.persons = results;

          var userMap = _.keyBy(data.users, 'personId');
          var personMap = _.keyBy(data.persons, 'personId');

          // console.log(userMap);

          var requests = [];
          _.forEach(personMap, function(obj) {
            var request = {
              group: req.body.group,
              personId: obj.personId,
              firstName: obj.firstName,
              lastName: obj.lastName,
              userId: userMap[obj.personId].userId
            }
            requests.push(request);
          })
          return requests;
        })
        .then(function(req) {
          return res.status(200).json({
            status: 'Retrieved all requests',
            requests: req
          })
        })
        .catch(function(err) {
          console.log(err);
          return res.status(500).json({
            status: 'Error retrieving requests'
          })
        })
      })

    })
}

exports.leaveGroup = function(req, res) {

  db.MemberOfGroup.find({ where: {user: req.body.user.userId, group: req.body.group.groupId}})
    .then(function(relation) {
      relation.destroy();
    })
    .then(function() {
      return res.status(200).json({
        status: 'Successfully left group'
      })
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Failed to leave group'
      })
    })
}