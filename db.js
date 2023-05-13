var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'harrybae1011!',
    database: 'login_database'
});
db.connect();

/*var id = 'harry';
var password = '1111';

db.query('INSERT INTO login (id, password) VALUES(?,?)', [id, password], function (error, data) {
  if (error) throw error;
  console.log('User info is: ', data);
});*/

module.exports = db;