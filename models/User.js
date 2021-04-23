const db = require("../utils/database");


module.exports = class User{

      constructor(email = null , username = null , password = null){
        this.email = email;
        this.username = username;
        this.password = password;
      }

      register(){
          const query = `
            INSERT INTO Users (username , user_email , user_password) VALUES ( ? , ? , ?)
          `;

          return db.query(query , [this.username , this.email , this.password]);
      }

     login(){
        const query = `
          SELECT userId , user_password FROM Users WHERE user_email = (?)
        `;
        return db.query(query , [this.email]);

      }

      
}
