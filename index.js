const resolvers = require('./graphql/resolvers/index.js');
const typeDefs = require('./graphql/typeDef');
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const SESSION_SECRET = "secret";
const {ApolloServer} =  require("apollo-server-express");
require("dotenv").config();
let count = 1;

const options = {
      host: process.env.AWS_RDS_HOST_NAME,
      port: 3306,
      password : process.env.AWS_RDS_PASSWORD,
      database: process.env.AWS_RDS_DATABASE_NAME,
      user : process.env.AWS_RDS_USER,
      schema: {
       tableName: 'sessions',
       columnNames: {
           session_id: 'session_id',
           expires: 'expires',
           data: 'data'
       } 
   }
  };
  
const express = require('express');
const { verifyToken } = require('./verifyToken.js');

const app = express();


const corsOption = {
credentials:true,
"origin":["https://competent-dubinsky-5ca84b.netlify.app" , "http://localhost:3000"],
optionsSuccessStatus:200,
};


app.use('/graphql', session({
  resave:true,
  name:"_gid",
  secret : SESSION_SECRET,
  saveUninitialized:false,
  cookie : {
    maxAge   : 7*24*60*60*1000,
  },
  store : new MySqlStore(options)
}));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req })=>{
    let isAuthenticated = false;
    let user = "";
    const authHeader= req.headers.authorization || "";
    try {
      if(authHeader){
        const token = authHeader.split(" ")[1];
        const payload = await verifyToken(token);
        isAuthenticated = payload  ? true : false ;
      }
    } catch (error) {
      console.error(error);
    }
    
    return {
      req ,
      isAuthenticated,
      user
    }
  },
});



server.applyMiddleware({app , path:'/graphql' , cors:corsOption })

const port = process.env.PORT || 8080;

app.post('/userData' , (req,res,next)=>{
 
  const logCount = req.query.logCount;
  console.log(req.query);
  console.log(count);

  if(count === 1 && logCount === 1){
    console.log("here");
    count++;
  }else{
    count = 1;
  }
  res.send(req.query.logCount);
  next();
});

app.get('/userData' , (req,res,next)=>{
  console.log(req.params);
  res.send("user here")
  next();
});


app.listen({port}, () =>
console.log(`Server ready at http://localhost:${port}`)
);
