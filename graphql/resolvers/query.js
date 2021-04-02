
module.exports = {
Query : {
      helloWorld : (_ , __ , context)=>{
        return "Hello World";
      },
      
      authMe : (_ , __ , {req})=>{
          return req.session.userId;
      }
}
}
