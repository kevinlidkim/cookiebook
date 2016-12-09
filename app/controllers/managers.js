
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

exports.loadTop5Ads = function(req, res) {

  var data ={};

  db.Sales.findAll()
  .then(function(sales){
    data.sales = sales;

    db.Advertisement.findAll()
    .then(function(advertisement){
      data.advertisement = advertisement;

      db.AdPostedBy.findAll()
      .then(function(adPostedBy){
        data.adPostedBy = adPostedBy;

      })
      .then(function() {
        return res.status(200).json({
          status: 'Loaded top 5 ads',
          data: data
        })
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({
          status: 'Failed Loaded top 5 ads'
        })
      })
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

          if(ads[data.sales[i].advertisementId] != null){
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

exports.salesSearchItemType = function(req, res) {

  var data = {};

  db.Sales.findAll()
  .then(function(sales) {
    data.sales = sales;

    var promise = [];
    _.forEach(sales, function(sale) {
      promise.push(db.Advertisement.find({ where: {advertisementId: sale.advertisementId, adType: {$like: '%' + req.body.query + '%'} } }));
    })

    Promise.all(promise).then(values => {
      data.ads = _.compact(values);

        //console.log(data.ads)

        if (data.ads.length > 0) {
          var ads = _.keyBy(data.ads, 'advertisementId');
          var dataValues = [];

          for (var i = 0; i < data.sales.length; i++) {
            if(ads[data.sales[i].advertisementId] != null){
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
            }
            dataValues.push(result);
          }
          data.transactions = _.compact(dataValues);
        }

      })
    .then(function() {
      return res.status(200).json({
        status: 'Loaded all sales data by itemType',
        data: data.transactions
      })
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Failed to load all sales data by itemType'
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
          data.accounts = _.compact(results);

          // Get all users from accounts
          var promiseUser = [];
          _.forEach(data.accounts, function(account) {
            promiseUser.push(db.User.find({ where: {userId: account.owner} }));
          })

          Promise.all(promiseUser).then(gotUsers => {
            data.users = _.compact(gotUsers);

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
              // Need to check because sales persist even if user is deleted
              if (accountMap[trans.accountNumber]) {
                accountMap[trans.accountNumber].transactions.push(trans.price);
              }
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

exports.getBestEmployee = function(req, res) {

  var data = {};

  // Get all sales
  db.Sales.findAll()
  .then(function(sales) {
    data.sales = sales;

      // Get all ads from sales
      var promise = [];
      _.forEach(sales, function(sale) {
        promise.push(db.Advertisement.find({ where: {advertisementId: sale.advertisementId} }));
      })

      Promise.all(promise).then(values => {
        data.ads = values;

        // Get all relation from ads
        var promiseRelation = [];
        _.forEach(values, function(ad) {
          promiseRelation.push(db.AdPostedBy.find({ where: {advertisement: ad.advertisementId} }));
        })

        Promise.all(promiseRelation).then(results => {
          data.adPostedBy = results;

          // Get all employees from relation
          var promiseEmployees = [];
          _.forEach(results, function(rel) {
            promiseEmployees.push(db.Employee.find({ where: {employeeId: rel.employee} }));
          })

          Promise.all(promiseEmployees).then(resolved => {
            data.employees = resolved;

            // Strip the arrays of duplicate values
            var employeeMap = _.keyBy(data.employees, 'employeeId');
            var adMap = _.keyBy(data.ads, 'advertisementId');
            var relationMap = _.keyBy(data.adPostedBy, 'advertisement');

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
                advertisementId: cost.advertisementId
              }
              costOfSales.push(result);
            })

            // Give each employee an ad posted array
            _.forEach(employeeMap, function(emp) {
              emp.ads = [];
            })

            // Now we link ad sales to employee
            _.forEach(costOfSales, function(trans) {
              var simplify = relationMap[trans.advertisementId].employee
              employeeMap[simplify].ads.push(trans.price);
            })

            // Now we sum up sales for each employee
            _.forEach(employeeMap, function(empl) {
              empl.sum = _.sum(empl.ads);
            })

            // Now we sort and reverse the array to get user with most money spent
            var sortedArray = _.reverse(_.sortBy(employeeMap, 'sum'));
            data.bestEmp = sortedArray[0];
            data.earned = data.bestEmp.sum;

          })
          .then(function() {
            return db.User.find({ where: {userId: data.bestEmp.userId} });
          })
          .then(function(bestUser) {
            data.bestUser = bestUser;
            return db.Person.find({ where: {personId: data.bestUser.personId} });
          })
          .then(function(bestPerson) {
            data.bestPerson = bestPerson;
            var bestObj = {
              firstName: bestPerson.firstName,
              lastName: bestPerson.lastName,
              userId: data.bestUser.userId,
              personId: data.bestUser.personId,
              employeeId: data.bestEmp.employeeId,
              earned: data.earned
            }
            data.best = bestObj;
          })
          .then(function() {
            return res.status(200).json({
              status: 'Successfully found employee who generated most revenue',
              data: data.best
            })
          })
          .catch(function(err) {
            console.log(err);
            return res.status(500).json({
              status: 'Failed to find employee who generated most revenue'
            })
          })

        })

      })
    })
}

exports.queryAllEmployees = function(req, res) {
  var userArray = [];
  var data = {};
  var arrayOfPersons;
  var arrayOfUsers;
  var employees = [];
  var array = [];

  db.Person.findAll({ where: Sequelize.or(
    ["firstName like ?", '%' + req.body.query + '%'],
    ["lastName like ?", '%' + req.body.query + '%']
    ) })
  .then(function(persons) {
    arrayOfPersons = _.compact(persons);
    _.forEach(persons, function(person) {
      userArray.push(db.User.find({ where: {personId: person.personId} }))
    })
    Promise.all(userArray).then(usersArray => {
      arrayOfUsers = _.compact(usersArray);
          //console.log(usersArray);
          //console.log(arrayOfUsers);

          _.forEach(usersArray, function(user) {
            array.push(db.Employee.find({ where: {userId: user.userId} }))
          })
          Promise.all(array).then(arrayOfEmployees => {
              //console.log(arrayOfEmployees);
              //console.log(arrayOfPersons);
              //console.log(arrayOfUsers);
              var compactEmployees = _.compact(arrayOfEmployees);
              var people = _.keyBy(arrayOfPersons, 'personId');
              var users = _.keyBy(arrayOfUsers, 'userId');

              _.forEach(compactEmployees, function(employee) {
                var result = {
                  employeeId: employee.employeeId,
                  email: users[employee.userId].email,
                  userId: employee.userId,
                  personId: users[employee.userId].personId,
                  firstName: people[users[employee.userId].personId].firstName,
                  lastName:  people[users[employee.userId].personId].lastName
                }
                employees.push(result);
              })

              data.employees = employees;
            })
          .then(function() {
            return res.status(200).json({
              status: 'Manager query for employees successful',
              data: data
            })
          })
          .catch(function(err) {
            console.log(err);
            return res.status(500).json({
              status: 'Error querying employees for search by manager'
            })
          })
        })
  })
}

exports.getEmployeeData = function(req, res) {
  var data = {};
  db.Employee.find({ where: {employeeId: req.body.employeeId} })
  .then(function(employee) {
    data.employeeId = employee.employeeId;
    data.hourlyRate = employee.hourlyRate;
    db.User.find({ where: {userId: employee.userId} })
    .then(function(user) {
      data.userId = user.userId;
      db.Person.find({ where: {personId: user.personId} })
      .then(function(person) {
        data.firstName = person.firstName;
        data.lastName = person.lastName;
        data.personId = person.personId;
      })
      .then(function() {
        return res.status(200).json({
          status: 'Successfully retrieved employee information',
          data: data
        })
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({
          status: 'Error retrieving employee information'
        })
      })
    })
  })
}

exports.updateEmployee = function(req, res) {
  var obj = {};

  if (req.body.personObj) {
    db.Person.update(req.body.personObj, {
      where: {
        personId: req.body.idObj.personId
      }
    })
    .then(function() {
      if (req.body.employeeObj) {
        db.Employee.update(req.body.employeeObj, {
          where: {
            employeeId: req.body.idObj.employeeId
          }
        })
        .then(function() {
          return db.Person.find({ where: {personId: req.body.idObj.personId} })
        })
        .then(function(person) {
          obj.personId = person.personId;
          obj.firstName = person.firstName;
          obj.lastName = person.lastName;
          return db.Employee.find({ where: {employeeId: req.body.idObj.employeeId} })
        })
        .then(function(employee) {
          obj.employeeId = employee.employeeId;
          return res.status(200).json({
            data: obj,
            status: 'Update employee successful'
          })
        })
        .catch(function(err) {
          console.log(err);
          return res.status(500).json({
            status: 'Error updating employee'
          })
        })
      } else {
        db.Person.find({ where: {personId: req.body.idObj.personId} })
        .then(function(person) {
          obj.personId = person.personId;
          obj.firstName = person.firstName;
          obj.lastName = person.lastName;
          return db.Employee.find({ where: {employeeId: req.body.idObj.employeeId} })
        })
        .then(function(employee) {
          obj.employeeId = employee.employeeId;
          return res.status(200).json({
            data: obj,
            status: 'Update employee successful'
          })
        })
      }

    })
    .catch(function(err) {
      console.log(err);
      return res.status(200).json({
        status: 'Error updating employee'
      })
    })
  } else if (req.body.employeeObj) {
    db.Employee.update(req.body.employeeObj, {
      where: {
        employeeId: req.body.idObj.employeeId
      }
    })
    .then(function() {
      return db.Employee.find({ where: {employeeId: req.body.idObj.employeeId} })
    })
    .then(function(employee) {
      obj.employeeId = employee.employeeId;
      return db.Person.find({ where: {personId: req.body.idObj.personId} })
    })
    .then(function(person) {
      obj.firstName = person.firstName,
      obj.lastName = person.lastName,
      obj.personId = person.personId
    })
    .then(function() {
      return res.status(200).json({
        data: obj,
        status: 'Update employee successful'
      })
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Error updating employee'
      })
    })
  }
}

exports.createEmployee = function(req, res) {
  var obj = {};
  // Check if employee with userId already exists
  db.Employee.find({ where: {userId: req.body.userId} })
  .then(function(employee) {
      // Create new employee if none exists
      if(!employee) {
        var date = new Date();
        req.body.employeeObj.startDate = date;
        req.body.employeeObj.userId = req.body.userId;
        db.Employee.create(req.body.employeeObj)
        .then(function() {
          obj.result = true;
          obj.message = "Employee successfully created."
          return res.status(200).json({
            status: 'Employee successfully created.',
            data: obj
          })
        })
        .catch(function(err) {
          obj.result = false;
          obj.message = "Error creating employee.";
          return res.status(500).json({
            status: 'Error creating employee.',
            data: obj
          })
        })
      }
      // Indicate error otherwise
      else {
        obj.result = false;
        obj.message = "Error: Customer is already an employe."
        return res.status(500).json({
          status: 'Customer with given email already exists.',
          data: obj
        })
      }
    })
}

exports.deleteEmployee = function(req, res) {
  var data = {};
  db.Employee.find({ where: {employeeId: req.body.employeeId} })
  .then(function(employee) {
    return employee.destroy();
  })
  .then(function() {
    return res.status(200).json({
      status: 'Successfully deleted employee'
    })
  })
  .catch(function(err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failed to delete employee'
    })
  })
}
