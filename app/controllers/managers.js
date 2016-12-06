var db = require('../../config/db');
var _ = require('lodash');

exports.loadAllAds = function(req, res) {
  var data = {};

  db.Advertisement.findAll()
    .then(function(ads) {
      data.ads = ads;
    })
    .then(function() {
      return res.status(200).json({
        status: 'Loaded all ads',
        data: data.ads
      })
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Failed to load all ads'
      })
    })
}

exports.loadMonthlyReport = function(req, res) {

  var startDate = new Date(2016, req.body.month - 1, 0);
  var endDate = new Date(2016, req.body.month, 0);
  var data = {};

  db.Sales.findAll({ where: {dateTimeSold: {$lt: endDate, $gt: startDate} }})
    .then(function(sales) {
      data.sales = sales;

      var promise = [];
      _.forEach(sales, function(sale) {
        promise.push(db.Advertisement.find({ where: {advertisementId: sale.advertisementId} }));
      })

      Promise.all(promise).then(values => {
        data.ads = values;

        var ads = _.keyBy(data.ads, 'advertisementId');
        var dataValues = [];

        for(var i = 0; i < data.sales.length; i++) {
          var result = {
            transactionId: data.sales[i].transactionId,
            dateTimeSold: data.sales[i].dateTimeSold,
            advertisementId: data.sales[i].advertisementId,
            numberOfUnits: data.sales[i].numberOfUnits,
            accountNumber: data.sales[i].accountNumber,
            adType: ads[data.sales[i].advertisementId].adType,
            company: ads[data.sales[i].advertisementId].company,
            itemName: ads[data.sales[i].advertisementId].itemName,
            unitPrice: ads[data.sales[i].advertisementId].unitPrice
          }
          dataValues.push(result);
        }
        data.transactions = dataValues;
      })
      .then(function() {
        return res.status(200).json({
          status: 'Loaded all sales data',
          data: data.transactions
        })
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({
          status: 'Failed to load all sales data'
        })
      })
    })
}