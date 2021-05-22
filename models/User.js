const db = require("../utils/database");


module.exports = class User{

      
  constructor(userId , picture=null , nickname=null , email){
    this.userId = userId;
    this.picture = picture;
    this.nickname = nickname;
    this.email = email;
    
  }
  
  register(){
    const query = `
            INSERT INTO Users (userId , picture , nickname , email) VALUES (?,?,?,?)
          `;
    return db.query(query , [this.userId , this.picture,this.nickname, this.email]);
  }   
}
