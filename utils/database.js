const mysql = require('mysql2');
const fs = require('fs');
require("dotenv").config();

const pool = mysql.createPool({
  host  : process.env.AWS_RDS_HOST_NAME,
  user  :  process.env.AWS_RDS_USER,
  database :process.env.AWS_RDS_DATABASE_NAME,
  password: process.env.AWS_RDS_PASSWORD,
  connectionLimit:10,
  ssl:{
    ca: fs.readFileSync(__dirname + '/rds-combined-ca-bundle.pem').toString(),
   }
});

module.exports = pool.promise();