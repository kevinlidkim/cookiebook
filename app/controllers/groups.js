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
        })
      })

    })

}

// exports.getGroupData = function(req, res) {

//   var data = {};

//   db.OwnsGroup.findAll({ where: {owner: req.body.you} })
//     .then(function(ownsGroup) {

//       console.log(ownsGroup[0]);
//       console.log(ownsGroup[0].owner);
//       console.log(ownsGroup[0].group);

//       var promiseArrayOwnsGroup = [];
//       _.forEach(ownsGroup, function(getGroup) {
//         // console.log(ownsGroup);
//         promiseArrayOwnsGroup.push(db.Group.find({ where: {groupId: getGroup.group} }));
//       })

//       Promise.all(promiseArrayOwnsGroup).then(values => {
//         data.ownsGroup = values;

//         var superPromiseArray = [];
//         var i = 0;
//         _.forEach(values, function(getRequests) {
//           superPromiseArray.push(db.JoinGroupRequest.findAll({ where: {group: values.groupId} }))
//         })

//         Promise.all(superPromiseArray).then(results => {
//           data.joinRequests = results;
//           console.log(results);
//         })

//       })

//       .then(function() {

//       })
      

//     })

// }

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