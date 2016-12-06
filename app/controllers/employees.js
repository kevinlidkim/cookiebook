var db = require('../../config/db');
var _ = require('lodash');


exports.createAd = function(req, res) {

  var data = {};
  
  db.Advertisement.create(req.body)
    .then(function(ad) {
      var date = new Date();
      var relation = {
        dateTimePosted: date,
        advertisement: ad.advertisementId,
        employee: req.body.employeeId 
      }
      data = ad;
      return db.AdPostedBy.create(relation)
    })
    .then(function() {
      return res.status(200).json({
        status: 'Successfully created advertisement',
        data: data
      })
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Failed to create advertisement'
      })
    })
}

exports.loadEmployeeAds = function(req, res) {

  var data = {};

  db.AdPostedBy.findAll({ where: {employee: req.body.employeeId} })
    .then(function(relations) {

      var promiseArray = [];
      _.forEach(relations, function(relation) {
        promiseArray.push(db.Advertisement.find({ where: {advertisementId: relation.advertisement} }));
      })

      Promise.all(promiseArray).then(values => {
        data.ads = values;
      })
      .then(function() {
        return res.status(200).json({
          status: 'Successfully retrieved all ads by this employee',
          data: data
        })
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({
          status: 'Failed to retrieve all ads by this employee'
        })
      })
    })
}

exports.deleteEmployeeAd = function(req, res) {

  db.AdPostedBy.find({ where: {advertisement: req.body.advertisementId} })
    .then(function(relation) {
      return relation.destroy();
    })
    .then(function() {
      return db.Advertisement.find({ where: {advertisementId: req.body.advertisementId} });
    })
    .then(function(ad) {
      return ad.destroy();
    })
    .then(function() {
      return res.status(200).json({
        status: 'Successfully deleted advertisement by this employee'
      })
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Failed to delete advertisement by this employee'
      })
    })
}

exports.getCustomerMailingList = function(req, res) {

  var data = {};

  // Get all ads posted by this employee
  db.AdPostedBy.findAll({ where: {employee: req.body.employeeId} })
    .then(function(relation) {

      // Get the sales from those ads
      var promise = [];
      _.forEach(relation, function(ads) {
        promise.push(db.Sales.findAll({ where: {advertisementId: ads.advertisement} }));
      })

      Promise.all(promise).then(values => {
        var flatten = [].concat.apply([], values);
        data.sales = flatten;

        // Get the account used in the sales
        var promiseAccount = [];
        _.forEach(flatten, function(sale) {
          promiseAccount.push(db.OwnsPurchaseAccount.find({ where: {accountNumber: sale.accountNumber} }));
        })

        Promise.all(promiseAccount).then(accounts => {
          data.accounts = accounts;

          // Get the user of the accounts
          var promiseUser = [];
          _.forEach(accounts, function(account) {
            promiseUser.push(db.User.find({ where: {userId: account.owner} }))
          })

          Promise.all(promiseUser).then(users => {
            data.users = users;
            
            // Get unique users
            var uniqueUsers = [];
            var userMap = _.keyBy(users, 'userId');
            _.forEach(userMap, function(uniqueUser) {
              var obj = {
                email: uniqueUser.email
              }
              uniqueUsers.push(obj);
            })
            data.uniqueUsers = uniqueUsers;

          })
          .then(function() {
            return res.status(200).json({
              status: 'Successfully retrieved customer mailing list',
              data: data.uniqueUsers
            })
          })
          .catch(function(err) {
            console.log(err);
            return res.status(500).json({
              status: 'Failed to retrieve customer mailing list'
            })
          })
        })

      })
    })
}