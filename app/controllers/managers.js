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

exports.salesSearchUser = function(req, res) {

  var data = {};

  // Get all persons with name like query
  db.Person.findAll({ where: Sequelize.or(
    ["firstName like ?", '%' + req.body.query + '%'],
    ["lastName like ?", '%' + req.body.query + '%']
    ) })
    .then(function(persons) {
      data.persons = persons;

      // Get all users from the persons
      var promiseArrayUser = [];
      _.forEach(persons, function(person) {
        promiseArrayUser.push(db.User.find({ where: {personId: person.personId} }));
      })

      Promise.all(promiseArrayUser).then(promiseUsers => {
        data.users = promiseUsers;

        // Get all purchase accounts owned by users
        var promiseArrayAccountRelation = [];
        _.forEach(promiseUsers, function(user) {
          promiseArrayAccountRelation.push(db.OwnsPurchaseAccount.findAll({ where: {owner: user.userId} }));
        })

        Promise.all(promiseArrayAccountRelation).then(promiseAccounts => {
          var flattenAccounts = [].concat.apply([], promiseAccounts);
          data.accounts = flattenAccounts;

          // Get all sales with the accounts
          var promiseArraySales = [];
          _.forEach(flattenAccounts, function(account) {
            promiseArraySales.push(db.Sales.findAll({ where: {accountNumber: account.accountNumber} }));
          })

          Promise.all(promiseArraySales).then(promiseSales => {
            var flattenSales = [].concat.apply([], promiseSales);
            data.sales = flattenSales

            // Get all ads from the sales
            var promiseArrayAds = [];
            _.forEach(flattenSales, function(sale) {
              promiseArrayAds.push(db.Advertisement.find({ where: {advertisementId: sale.advertisementId} }));
            })

            Promise.all(promiseArrayAds).then(promiseAds => {
              data.ads = promiseAds;

              // Merge users and persons into one entity
              var personMap = _.keyBy(data.persons, 'personId');
              var userPerson = [];
              for (var a = 0; a < data.users.length; a++) {
                var result = {
                  personId: data.users[a].personId,
                  userId: data.users[a].userId,
                  firstName: personMap[data.users[a].personId].firstName,
                  lastName: personMap[data.users[a].personId].lastName
                }
                userPerson.push(result);
              }
              data.userPerson = userPerson;

              // Merge userperson and accounts
              var userPersonMap = _.keyBy(userPerson, 'userId');
              var accountOwner = [];

              for (var b = 0; b < data.accounts.length; b++) {
                var result = {
                  accountNumber: data.accounts[b].accountNumber,
                  personId: userPersonMap[data.accounts[b].owner].personId,
                  userId: data.accounts[b].owner,
                  firstName: userPersonMap[data.accounts[b].owner].firstName,
                  lastName: userPersonMap[data.accounts[b].owner].lastName
                }
                accountOwner.push(result);
              }
              data.accountOwner = accountOwner;

              // Merge account entity with sales and ads
              var accountMap = _.keyBy(accountOwner, 'accountNumber');

              var adMap = _.keyBy(promiseAds, 'advertisementId')
              var allData = [];
              for (var i = 0; i < data.sales.length; i++) {
                var result = {
                  transactionId: data.sales[i].transactionId,
                  dateTimeSold: data.sales[i].dateTimeSold,
                  advertisementId: data.sales[i].advertisementId,
                  numberOfUnits: data.sales[i].numberOfUnits,
                  accountNumber: data.sales[i].accountNumber,
                  adType: adMap[data.sales[i].advertisementId].adType,
                  company: adMap[data.sales[i].advertisementId].company,
                  itemName: adMap[data.sales[i].advertisementId].itemName,
                  unitPrice: adMap[data.sales[i].advertisementId].unitPrice,
                  personId: accountMap[data.sales[i].accountNumber].personId,
                  userId: accountMap[data.sales[i].accountNumber].userId,
                  firstName: accountMap[data.sales[i].accountNumber].firstName,
                  lastName: accountMap[data.sales[i].accountNumber].lastName
                }
                allData.push(result);
              }
              data.allData = allData;

            })
            .then(function() {
              return res.status(200).json({
                status: 'Loaded all sales data by user',
                data: data.allData
              })
            })
            .catch(function(err) {
              console.log(err);
              return res.status(500).json({
                status: 'Failed to load all sales data by user'
              })
            })

          })

        })
      })

    })

}

exports.salesSearchItem = function(req, res) {

  var data = {};

  db.Sales.findAll()
    .then(function(sales) {
      data.sales = sales;

      var promise = [];
      _.forEach(sales, function(sale) {
        promise.push(db.Advertisement.find({ where: {advertisementId: sale.advertisementId, itemName: {$like: '%' + req.body.query + '%'} } }));
      })

      Promise.all(promise).then(values => {
        data.ads = _.compact(values);

        if (data.ads.length > 0) {
          var ads = _.keyBy(data.ads, 'advertisementId');
          var dataValues = [];

          for (var i = 0; i < data.sales.length; i++) {
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
        }

      })
      .then(function() {
        return res.status(200).json({
          status: 'Loaded all sales data by item',
          data: data.transactions
        })
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({
          status: 'Failed to load all sales data by item'
        })
      })
    })
}

exports.companySearch = function(req, res) {

  var data = {};
  db.Advertisement.findAll({ where: {company: {$like: '%' + req.body.query + '%'} } })
    .then(function(ads) {
      data.ads = ads;
    })
    .then(function() {
      return res.status(200).json({
        status: 'Successfully retrieved ads by company name',
        data: data
      })
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Failed to retrieve ads by company name'
      })
    })
}

exports.getRichestUser = function(req, res) {

  var data = {};

  // Get all sales
  db.Sales.findAll()
    .then(function(sales) {
      data.sales = sales;

      // Get all ads from the sales
      var promise = [];
      _.forEach(sales, function(sale) {
        promise.push(db.Advertisement.find({ where: {advertisementId: sale.advertisementId} }));
      })

      Promise.all(promise).then(values => {
        data.ads = values;

        // Get all account relation involved in sales
        var promiseRelation = [];
        _.forEach(data.sales, function(trans) {
          promiseRelation.push(db.OwnsPurchaseAccount.find({ where: {accountNumber: trans.accountNumber} }));
        })

        Promise.all(promiseRelation).then(results => {
          data.accounts = results;

          // Get all users from accounts
          var promiseUser = [];
          _.forEach(data.accounts, function(account) {
            promiseUser.push(db.User.find({ where: {userId: account.owner} }));
          })

          Promise.all(promiseUser).then(gotUsers => {
            data.users = gotUsers;

            // Strip the arrays of duplicate values
            var accountMap = _.keyBy(data.accounts, 'accountNumber');
            var adMap = _.keyBy(data.ads, 'advertisementId');
            var userMap = _.keyBy(data.users, 'userId');

            var map = {
              account: accountMap,
              ad: adMap,
              user: userMap
            }
            data.map = map;

            // Now we calculate how much money was spent for each transaction
            var costOfSales = [];
            _.forEach(data.sales, function(cost) {

              var quantity = 0;
              if (cost.numberOfUnits) {
                quantity = cost.numberOfUnits;
              } else {
                quantity = 1;
              }

              var price = adMap[cost.advertisementId].unitPrice * quantity;

              var result = {
                price: price,
                accountNumber: cost.accountNumber,
              }
              costOfSales.push(result);
            })

            // Give each account an array of transactions
            _.forEach(accountMap, function(accObj) {
              accObj.transactions = [];
            })

            // Now we link each transaction to its appropriate account
            _.forEach(costOfSales, function(trans) {
              accountMap[trans.accountNumber].transactions.push(trans.price);
            })

            // Now we get the sum of transactions
            _.forEach(accountMap, function(acc) {
              acc.sum = _.sum(acc.transactions);
            })

            // Give each user an array of accounts
            _.forEach(userMap, function(userObj) {
              userObj.accounts = [];
            })

            // Now we link the account to the respective user
            _.forEach(accountMap, function(bankAcc) {
              userMap[bankAcc.owner].accounts.push(bankAcc.sum);
            })

            // Now we sum up purchases over all bank accounts for each user
            _.forEach(userMap, function(user) {
              user.sum = _.sum(user.accounts);
            })

            // Now we sort and reverse the array to get user with most money spent
            var sortedArray = _.reverse(_.sortBy(userMap, 'sum'));
            data.richestUser = sortedArray[0];
            data.spent = data.richestUser.sum;

          })
          .then(function() {
            return db.Person.find({ where: {personId: data.richestUser.personId} });
          })
          .then(function(richPerson) {
            data.richestPerson = richPerson;
            var richObj = {
              firstName: richPerson.firstName,
              lastName: richPerson.lastName,
              userId: data.richestUser.userId,
              personId: data.richestUser.personId,
              spent: data.spent
            }
            data.rich = richObj;
          })
          .then(function() {
            return res.status(200).json({
              status: 'Successfully found user who spent the most money',
              data: data.rich
            })
          })
          .catch(function(err) {
            console.log(err);
            return res.status(500).json({
              status: 'Failed to find user who spent the most money'
            })
          })
        })
      })

    })
}