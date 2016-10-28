var mysql = require('mysql');

var secret = require('./secret.json');

var connection = mysql.createConnection({
  host     : secret.host,
  user     : secret.user,
  password : secret.password,
  database : secret.database
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;