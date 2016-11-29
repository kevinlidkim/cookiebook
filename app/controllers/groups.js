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
        })
        .then(function() {
          data.memberOfGroup = _.differenceWith(data.allGroup, data.ownsGroup, _.isEqual);
        })
        .then(function() {
          return res.status(200).json({
            status: 'Successfully retrieved groups',
            data: data
          })
        })
        .catch(function(err) {
          console.log(err);
          return res.status(500).json({
            status: 'Failed to retrieve groups'
          })
        })
      })

    })

}