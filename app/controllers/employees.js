var db = require('../../config/db');
var _ = require('lodash');


exports.createAd = function(req, res) {

  var data = {}
  
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