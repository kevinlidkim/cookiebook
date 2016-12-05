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
    db.Group.find({ where: {groupId: req.body.groupId} })
      .then(function(groupToDelete) {
        if (groupToDelete) {
          // Get info related to group tod delete
          db.OwnsGroup.find({ where: {group: req.body.groupId} })
            .then(function(ownsGroupToDelete) {
              db.OwnsGroup.destroy({ where: {group: req.body.groupId} })
            })
          db.MemberOfGroup.findAll({ where: {group: req.body.groupId} })
            .then(function(membersOfGroupToRemove) {
              if(membersOfGroupToRemove) {
                db.MemberOfGroup.destroy({ where: {group: req.body.groupId} })
              }
            })
          db.JoinGroupRequest.findAll({ where: {group: req.body.groupId} })
            .then(function(joinGroupRequestsToDelete) {
              if(joinGroupRequestsToDelete) {
                db.JoinGroupRequest.destroy({ where: {group: req.body.groupId} })
              }
            })
          db.SendGroupRequest.findAll({ where: {group: req.body.groupId} })
            .then(function(sendGroupRequestsToDelete) {
              if(sendGroupRequestsToDelete) {
                db.SendGroupRequest.destroy({ where: {group: req.body.groupId} })
              }
            })
          // Begin to delete the post, comment, likesPost and likesComment data
          /* db.OwnsPage.find({ where: {group: req.body.groupId} })
            .then(function(ownsPageToDelete) {
              console.log(ownsPageToDelete);
              db.Page.find({ where: {pageId: ownsPageToDelete.page}})
                .then(function(pageToDelete) {
                  console.log(pageToDelete);
                  db.PostedOn.findAll({ where: {page: pageToDelete.pageId} })
                    .then(function(postedOnToDelete) {
                      console.log(postedOnToDelete);
                      if(postedOnToDelete) {
                        // For each post, delete its comments, likesComments and likesPost
                        _.forEach(postedOnToDelete, function(postedOn) {
                          db.Post.find({ where: {postId: postedOn.post} })
                            .then(function(postToDelete) {
                              console.log(postToDelete);
                              db.LikesPost.findAll({ where: {post: postToDelete.postId} })
                                .then(function(likesPostToDelete) {
                                  console.log(likesPostToDelete);
                                  if(likesPostToDelete) {
                                    db.LikesPost.destroy({ where: {post: postToDelete.postId} })
                                  }
                                })
                              db.CommentedOn.findAll({ where: {post: postToDelete.postId} })
                                .then(function(commentedOnToDelete) {
                                  console.log(commentedOnToDelete);
                                  if(commentedOnToDelete) {
                                    var commentPromiseArray = [];
                                    // For each comment, delete its likes and itself
                                    _.forEach(commentedOnToDelete, function(commentedOn) {
                                      commentPromiseArray.push(db.Comment.find({ where: {commentId: commentedOn.comment} }));
                                    })
                                    Promise.all(commentPromiseArray).then(values => {
                                      console.log(values);
                                      _.forEach(values, function(commentToDelete) {
                                        db.LikesComment.findAll({ where: {comment: commentToDelete.commentId} })
                                          .then(function(likesCommentToDelete) {
                                            console.log(likesCommentToDelete);
                                            if(likesCommentToDelete) {
                                              db.LikesComment.destroy({ where: {comment: commentToDelete.commentId} })
                                            }
                                          })
                                        Promise.all(commentToDelete).then(values => {
                                          console.log(values);
                                          db.Comment.destroy({ where: {commentId: values.commentId} })
                                        })
                                      })
                                    })
                                  }
                                })
                                .then(function() {
                                  db.CommentedOn.destroy({ where: {post: postToDelete.postId} })
                                })
                            })
                            .then(function() {
                              db.Post.destroy({ where: {postId: postedOn.post} })
                            })
                        })
                      }
                    })
                    .then(function() {
                      db.PostedOn.destroy({ where: {page: pageToDelete.pageId} })
                    })
                    .then(function() {
                      db.Page.destroy({ where: {pageId: ownsPageToDelete.page}})
                    })
                })
                .then(function() {
                  db.OwnsPage.destroy({ where: {group: req.body.groupId} })
                })
            })*/
          Promise.all(groupToDelete).then(values => {
              db.Group.destroy({ where: {groupId: req.body.groupId} })
          })
          .then(function() {
            return res.status(200).json({
              status: 'Delete group successful'
            })
          })
        }
        else {
          return res.status(500).json({
            status: 'Group to delete did not exist'
          })
        }
      })
      .catch(function(err) {
        return res.status(500).json({
          status: 'Error deleting group'
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
