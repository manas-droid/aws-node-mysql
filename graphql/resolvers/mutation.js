const argon = require('argon2');
const User = require("../../models/User.js");

module.exports = {
Mutation : {
      register : async(_ , {email,username,password})=>{
        let user;
        try {
          const hash = await argon.hash(password);
           user = new User(email , username , hash);
          const result = await user.register();
          console.log(result[0]);
        } catch (e) {
            throw new Error(e);
        }
        return true;
      } ,
      login : async(_ , {email , password} , {req})=>{
          const user  = new User();
          try {
            const findUser = await user.login(email);
            const resultUser = findUser[0][0];
            if(!resultUser){
              throw new Error("user not found");
            }

            const check = await argon.verify(resultUser.user_password , password);
            if(!check){
              throw new Error("password's incorrect");
            }
            console.log("reached here");
            req.session.userId = resultUser.userId;
          } catch (e) {
            throw new Error(e);
          }
          return true;
      } ,

      


}
}



// duplicate  errno : 1062
