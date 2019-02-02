var mysql = require('mysql');

var mySqlClient = mysql.createConnection({
  host      : process.env.DB_HOST,
  user      : process.env.DB_USER,
  password  : process.env.DB_PASSWORD,
  database  : process.env.DB_DATABASE,
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
  // socketPath: process.env.DB_SOCKET_PATH
});

module.exports = mySqlClient;
