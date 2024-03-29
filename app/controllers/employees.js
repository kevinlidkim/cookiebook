var db = require('../../config/db');
var crypto = require('crypto');
var _ = require('lodash');

var makeSalt = function() {
  return crypto.randomBytes(16).toString('base64');
}

var encryptPassword = function(password, salt) {
  if (!password || !salt) {
    return '';
  }
  salt = new Buffer(salt, 'base64');
  return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
}

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

exports.loadTop5AdsEmployee = function(req, res) {

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
          status: 'Loaded top 5 ads employee',
          data: data
        })
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({
          status: 'Failed Loaded top 5 ads employee'
        })
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

exports.queryAllCustomers = function(req, res) {
  var array = [];
  var data = {};
  var arrayOfPersons;
  var users = [];

  db.Person.findAll({ where: Sequelize.or(
    ["firstName like ?", '%' + req.body.query + '%'],
    ["lastName like ?", '%' + req.body.query + '%']
    ) })
    .then(function(persons) {
      arrayOfPersons = _.compact(persons);

      _.forEach(persons, function(person) {
        array.push(db.User.find({ where: {personId: person.personId} }))
      })

      Promise.all(array).then(arrayOfUsers => {
        var compactUser = _.compact(arrayOfUsers);

        var people = _.keyBy(arrayOfPersons, 'personId');
        _.forEach(compactUser, function(user) {
          var result = {
            email: user.email,
            userId: user.userId,
            personId: user.personId,
            firstName: people[user.personId].firstName,
            lastName: people[user.personId].lastName
          }
          users.push(result);
        })

        data.users = users;
      })
      .then(function() {
        return res.status(200).json({
          status: 'Employee query for customers successful',
          data: data
        })
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({
          status: 'Error querying customers for search by employee'
        })
      })
    })
}

exports.getCustomerData = function(req, res) {
  var data = {};
  db.User.find({ where: {userId: req.body.userId} })
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
            status: 'Successfully retrieved customer information',
            data: data
          })
        })
        .catch(function(err) {
          console.log(err);
          return res.status(500).json({
            status: 'Error retrieving customer information'
          })
        })
    })
}

exports.updateCustomer = function(req, res) {
    var obj = {};

    if (req.body.personObj) {
      db.Person.update(req.body.personObj, {
        where: {
          personId: req.body.idObj.personId
        }
      })
        .then(function() {
          if (req.body.userObj) {
            if (req.body.userObj.password) {
              var salt = makeSalt();
              var hashedPassword = encryptPassword(req.body.userObj.password, salt);
              req.body.userObj.salt = salt;
              req.body.userObj.hashedPassword = hashedPassword;
            }
            db.User.update(req.body.userObj, {
              where: {
                userId: req.body.idObj.userId
              }
            })
              .then(function() {
                return db.Person.find({ where: {personId: req.body.idObj.personId} })
              })
              .then(function(person) {
                obj.personId = person.personId;
                obj.firstName = person.firstName;
                obj.lastName = person.lastName;
                return db.User.find({ where: {personId: person.personId} })
              })
              .then(function(user) {
                obj.userId = user.userId;
                return res.status(200).json({
                  data: obj,
                  status: 'Update customer successful'
                })
              })
              .catch(function(err) {
                console.log(err);
                return res.status(500).json({
                  status: 'Error updating customer'
                })
              })
          } else {
            db.Person.find({ where: {personId: req.body.idObj.personId} })
              .then(function(person) {
                obj.personId = person.personId;
                obj.firstName = person.firstName;
                obj.lastName = person.lastName;
                return db.User.find({ where: {personId: person.personId} })
              })
              .then(function(user) {
                obj.userId = user.userId;
                return res.status(200).json({
                  data: obj,
                  status: 'Update customer successful'
                })
              })
          }

        })
        .catch(function(err) {
          console.log(err);
          return res.status(200).json({
            status: 'Error updating customer person'
          })
        })
    } else if (req.body.userObj) {
      if (req.body.userObj.password) {
        var salt = makeSalt();
        var hashedPassword = encryptPassword(req.body.userObj.password, salt);
        req.body.userObj.salt = salt;
        req.body.userObj.hashedPassword = hashedPassword;
      }
      db.User.update(req.body.userObj, {
        where: {
          userId: req.body.idObj.userId
        }
      })
        .then(function() {
          return db.User.find({ where: {userId: req.body.idObj.userId} })
        })
        .then(function(user) {
          obj.userId = user.userId;
          return db.Person.find({ where: {personId: user.personId} })
        })
        .then(function(person) {
          obj.firstName = person.firstName,
          obj.lastName = person.lastName,
          obj.personId = person.personId
        })
        .then(function() {
          return res.status(200).json({
            data: obj,
            status: 'Update customer successful'
          })
        })
        .catch(function(err) {
          console.log(err);
          return res.status(500).json({
            status: 'Error updating customer'
          })
        })
    }
}

exports.getCustomerGroup = function(req, res) {

  var data = {};

  db.MemberOfGroup.findAll({ where: {user: req.body.userId} })
    .then(function(member) {
      data.member = member;

      var promise = [];
      _.forEach(member, function(group) {
        promise.push(db.Group.find({ where: {groupId: group.group} }));
      })

      Promise.all(promise).then(values => {
        data.groups = values;
      })
      .then(function() {
        return res.status(200).json({
          status: 'Got all groups from customer',
          data: data.groups
        })
      })
      .catch(function() {
        return res.status(500).json({
          status: 'Failed to get groups from customer'
        })
      })

    })
}

exports.getCustomerTransactions = function(req, res) {

  var data = {};

  // Get all accounts owned by user
  db.OwnsPurchaseAccount.findAll({ where: {owner: req.body.userId} })
    .then(function(accounts) {
      data.accounts = accounts;

      // Get all sales from accounts
      var promise = [];
      _.forEach(accounts, function(account) {
        promise.push(db.Sales.findAll({ where: {accountNumber: account.accountNumber} }));
      })

      Promise.all(promise).then(values => {
        var sales = [].concat.apply([], values);
        data.sales = sales;

        // Get all ads from sales
        var promiseSale = [];
        _.forEach(sales, function(sale) {
          promiseSale.push(db.Advertisement.find({ where: {advertisementId: sale.advertisementId} }));
        })

        Promise.all(promiseSale).then(results => {
          data.ads = results;

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
            status: 'Successfully retrieved customer transactions',
            data: data.transactions
          })
        })
        .catch(function(err) {
          return res.status(500).json({
            status: 'Failed to retrieve customer transactions'
          })
        })
      })

    })
}

exports.createCustomer = function(req, res) {
  var obj = {};
  // Check if a customer with the given email exists
  db.User.find({ where: { email: req.body.userObj.email }})
    .then(function(user) {
      // Create new customer when they do not exist
      if (!user) {
        var person = db.Person.create(req.body.personObj)
          .then(function(newPerson) {
            var date = new Date();
            var salt = makeSalt();
            var hashedPassword = encryptPassword(req.body.password, salt);
            req.body.userObj.accountCreateDate = date;
            req.body.userObj.personId = newPerson.personId;
            req.body.userObj.salt = salt;
            req.body.userObj.hashedPassword = encryptPassword(req.body.userObj.password, salt);
            return db.User.create(req.body.userObj);
          })
          .then(function(returnUser) {
            var newPage = {
              postCount: 0
            }
            db.Page.create(newPage)
              .then(function(page) {
                var relation = {
                  page: page.pageId,
                  owner: returnUser.userId
                }
                return db.OwnsPage.create(relation);
              })
              .then(function() {
                obj.result = true;
                obj.message = "Customer successfully created."
                return res.status(200).json({
                  status: 'Customer successfully created.',
                  data: obj
                })
              })
              .catch(function(err) {
                obj.result = false;
                obj.message = "Error creating customer.";
                return res.status(500).json({
                  status: 'Error creating customer.',
                  data: obj
                })
              })
          })
      }
      // Indicate error otherwise
      else {
        obj.result = false;
        obj.message = "Error: Customer with given email already exists."
        return res.status(500).json({
          status: 'Customer with given email already exists.',
          data: obj
        })
      }
    })
}

exports.deleteCustomer = function(req, res) {
  var data = {};
  // Get all groups the customer is a member of
  db.MemberOfGroup.findAll({ where: {user: req.body.userId} })
    .then(function(memberOfGroupToDelete) {
      data.memberOfGroupToDelete = memberOfGroupToDelete;
      // Get all messages received by the customer
      return db.SentMessage.findAll({
          where: Sequelize.or(
            {sender: req.body.userId},
            {receiver: req.body.userId}
          )
      });
    })
    .then(function(sentMessageToDelete) {
      data.sentMessageToDelete = sentMessageToDelete;
      var promiseArrayMessagesReceived = [];

      _.forEach(sentMessageToDelete, function(sentMessage) {
        promiseArrayMessagesReceived.push(db.Message.find({ where: {messageId: sentMessage.message} }))
      })

      Promise.all(promiseArrayMessagesReceived).then(values => {
        data.messagesToDelete = values;

        // Get all friend relations user is involved in
        db.FriendsRequest.findAll({
          where: Sequelize.or(
            {user: req.body.userId},
            {friend: req.body.userId}
          )
        })
          .then(function(friendsRequestToDelete) {
            data.friendsRequestToDelete = friendsRequestToDelete;
            return db.FriendsWith.findAll({
              where: Sequelize.or(
                {user: req.body.userId},
                {friend: req.body.userId}
              )
            });
          })
          .then(function(friendsWithToDelete) {
            data.friendsWithToDelete = friendsWithToDelete;

            // Get all purchase accounts owned by the customer
            return db.OwnsPurchaseAccount.findAll({ where: {owner: req.body.userId} });
          })
          .then(function(ownsPurchaseAccountToDelete) {
            data.ownsPurchaseAccountToDelete = ownsPurchaseAccountToDelete;
            var promiseArrayOwnsPurchaseAccount = [];

            _.forEach(ownsPurchaseAccountToDelete, function(ownsPurchaseAccount) {
              promiseArrayOwnsPurchaseAccount.push(db.PurchaseAccount.find({ where: {accountNumber: ownsPurchaseAccount.accountNumber} }));
            })
            Promise.all(promiseArrayOwnsPurchaseAccount).then(values1 => {
              data.purchaseAccountToDelete = values1;

              // Get the page object
              db.OwnsPage.find({ where: {owner: req.body.userId} })
                .then(function(ownsPageToDelete) {
                  data.ownsPageToDelete = ownsPageToDelete;
                  return db.Page.find({ where: {pageId: ownsPageToDelete.page} })
                })
                .then(function(pageToDelete) {
                  data.pageToDelete = pageToDelete;

                  // Get all post relations on the page
                  return db.PostedOn.findAll({ where: {page: pageToDelete.pageId} })
                })
                .then(function(postedOnToDelete) {
                  data.postedOnToDelete = postedOnToDelete;

                  // Get all posts from the relation
                  var promiseArrayPosts = [];
                  _.forEach(postedOnToDelete, function(obj) {
                    promiseArrayPosts.push(db.Post.find({ where: {postId: obj.post} }));
                  })
                  Promise.all(promiseArrayPosts).then(values2 => {
                    data.postsToDelete = values2;

                    // Get all the comment and like relations from the posts
                    var promiseArrayComments = [];
                    var promiseArrayLikesPost = [];
                    _.forEach(values2, function(post) {
                      promiseArrayComments.push(db.CommentedOn.findAll({ where: {post: post.postId} }));
                      promiseArrayLikesPost.push(db.LikesPost.findAll({ where: {post: post.postId} }));
                    })

                    Promise.all(promiseArrayLikesPost).then(values3 => {
                      var likesPostToDelete = [].concat.apply([], values3);
                      data.likesPostToDelete = likesPostToDelete;

                      Promise.all(promiseArrayComments).then(values4 => {
                        var commentRelationsToDelete = [].concat.apply([], values4);
                        data.commentRelationsToDelete = commentRelationsToDelete;

                        // Get all the comments and like relations from the comments
                        var promiseArrayAllComments = [];
                        var promiseArrayLikesComments = [];
                        _.forEach(commentRelationsToDelete, function(comment) {
                          promiseArrayAllComments.push(db.Comment.findAll({ where: {commentId: comment.comment} }));
                          promiseArrayLikesComments.push(db.LikesComment.findAll({ where: {comment: comment.comment} }))
                        })

                        Promise.all(promiseArrayLikesComments).then(values5 => {
                          var commentLikesToDelete = [].concat.apply([], values5);
                          data.commentLikesToDelete = commentLikesToDelete;

                          Promise.all(promiseArrayAllComments).then(values6 => {
                            var commentsToDelete = [].concat.apply([], values6);
                            data.commentsToDelete = commentsToDelete;
                          })
                          .then(function() {
                            // Now that all customer info is collected, we begin to delete it

                            var deleteAllThisFirst = [];

                            // Delete each member of group relation
                            _.forEach(data.memberOfGroupToDelete, function(memberOfGroupToDelete) {
                              return db.MemberOfGroup.destroy({ where: {user: memberOfGroupToDelete.user} });
                            })

                            // Delete each sent message relation
                            _.forEach(data.sentMessageToDelete, function(sentMessageToDelete) {
                              return db.SentMessage.destroy({
                                where: Sequelize.or(
                                  {sender: sentMessageToDelete.sender},
                                  {receiver: sentMessageToDelete.receiver}
                                )
                              });
                            })

                            // Delete each message
                            _.forEach(data.messagesToDelete, function(messageToDelete) {
                              return db.Message.destroy({ where: {messageId: messageToDelete.messageId} });
                            })

                            // Delete each frend request relation
                            _.forEach(data.friendsRequestToDelete, function(friendsRequestToDelete) {
                              return db.FriendsRequest.destroy({
                                where: Sequelize.or(
                                  {user: req.body.userId},
                                  {friend: req.body.userId}
                                )
                              });
                            })

                            // Delete each friends with relation
                            _.forEach(data.friendsWithToDelete, function(friendsWithToDelete) {
                              return db.FriendsWith.destroy({
                                where: Sequelize.or(
                                  {user: req.body.userId},
                                  {friend: req.body.userId}
                                )
                              });
                            })

                            // Delete each owns PurchaseAccount relation
                            _.forEach(data.ownsPurchaseAccountToDelete, function(ownsPurchaseAccountToDelete) {
                              return db.OwnsPurchaseAccount.destroy({ where: {owner: ownsPurchaseAccountToDelete.owner} });
                            })

                            // Delete each purchase account
                            // _.forEach(data.purchaseAccountToDelete, function(purchaseAccountToDelete) {
                            //   return db.PurchaseAccount.destroy({ where: {accountNumber: purchaseAccountToDelete.accountNumber}});
                            // })

                            // Delete each likes comment relation
                            _.forEach(data.commentLikesToDelete, function(commentLikesToDelete) {
                              deleteAllThisFirst.push(db.LikesComment.destroy({ where: {comment: commentLikesToDelete.comment} }));
                            })


                            // Delete each commented on relation
                            _.forEach(data.commentRelationsToDelete, function(commentRelationToDelete) {
                              deleteAllThisFirst.push(db.CommentedOn.destroy({ where: {comment: commentRelationToDelete.comment} }));
                            })

                            // Delete each likes post relation
                            _.forEach(data.likesPostToDelete, function(likesPostToDelete) {
                              deleteAllThisFirst.push(db.LikesPost.destroy({ where: {post: likesPostToDelete.post} }));
                            })

                            // Delete each posted on relation
                            _.forEach(data.postedOnToDelete, function(postedOnToDelete) {
                              deleteAllThisFirst.push(db.PostedOn.destroy({ where: {post: postedOnToDelete.post} }));
                            })

                            deleteAllThisFirst.push(db.OwnsPage.destroy({ where: {owner: data.ownsPageToDelete.owner} }));

                            Promise.all(deleteAllThisFirst).then(deletedRelations => {

                            })
                            .then(function() {
                              // Delete each comment
                              _.forEach(data.commentsToDelete, function(commentToDelete) {
                                return db.Comment.destroy({ where: {commentId: commentToDelete.commentId} });
                              })
                            })
                            .then(function() {
                              // Delete each post
                              _.forEach(data.postsToDelete, function(postToDelete) {
                                return db.Post.destroy({ where: {postId: postToDelete.postId} })
                              })
                            })
                            .then(function() {
                              // Delete the page
                              return db.Page.destroy({ where: {pageId: data.pageToDelete.pageId} });
                            })
                            .then(function() {
                              return db.SendGroupRequest.destroy({ where: {user: req.body.userId}});
                            })
                            .then(function() {
                              return db.JoinGroupRequest.destroy({ where: {user: req.body.userId} });
                            })
                            .then(function() {
                              // Delete the customer account data
                              return db.User.destroy({ where: {userId: req.body.userId} })
                            })
                            .then(function() {
                              // Delete the person info associated with the customer
                              return db.Person.destroy({ where: {personId: req.body.personId} });
                            })
                            .then(function() {
                              return res.status(200).json({
                                status: 'Successfully deleted customer'
                              })
                            })
                            .catch(function(err) {
                              console.log(err);
                              return res.status(500).json({
                                status: 'Failed to delete customer'
                              })
                            })

                          })
                        })
                      })
                    })
                  })
                })
            })
          })
        })
    })
}

exports.loadSuggestedAds = function(req, res) {
  var data = {}

  db.OwnsPurchaseAccount.find({ where: {owner: req.body.userId} })
    .then(function(ownsPurchaseAccount) {
      return db.Sales.find({ where: {accountNumber: ownsPurchaseAccount.accountNumber} });
    })
    .then(function(sale) {
      return db.Advertisement.find({ where: {advertisementId: sale.advertisementId} });
    })
    .then(function(advertisement) {
      var companyName = advertisement.company;
      var adType = advertisement.adType;
      return db.Advertisement.findAll({
        where: Sequelize.or(
          ["company like ?", '%' + companyName + '%'],
          ["adType like ?", '%' + adType + '%']
        )
      });
    })
    .then(function(suggestedAds) {
      return res.status(200).json({
        status: 'Successfully found similar ads',
        data: suggestedAds
      })
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({
        status: 'Failed to find ads to suggest'
      })
    })
}
