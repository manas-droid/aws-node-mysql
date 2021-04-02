const mysql = require('mysql2');

const pool = mysql.createPool({
  host  : 'localhost',
  user  :  'root',
  database : 'book_blog',
  password: 'manas@904',
});
module.exports = pool.promise();
