const resolvers = require('./graphql/resolvers/index.js');
const typeDefs = require('./graphql/typeDef');
const {ApolloServer} =  require("apollo-server-express");
require("dotenv").config();

  
const express = require('express');
const { verifyToken } = require('./verifyToken.js');

const app = express();

const corsOption = {
credentials:true,
"origin":["https://competent-dubinsky-5ca84b.netlify.app" , "http://localhost:3000"],
optionsSuccessStatus:200,
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req })=>{
    let user = "";
    const authHeader= req.headers.authorization || "";
    try {
      if(authHeader){
        const token = authHeader.split(" ")[1];
        const payload = await verifyToken(token);
        user = payload ? payload.sub : ""; 
      }
    } catch (error) {
      console.error(error);
    }
    return {
      req ,
      user
    }
  },
});



server.applyMiddleware({app , path:'/graphql' , cors:corsOption })

const port = process.env.PORT || 8080;

app.post('/userData' , (req,res,next)=>{
 
  console.log(req.query);
  if(req.query.logCount == 1){
    console.log("here");
  }
  res.send("success");
  next();
});

app.get('/userData' , (req,res,next)=>{
  console.log(req.params);
  res.send("user here")
  next();
});


app.listen({port}, async() =>{
console.log(`Server ready at http://localhost:${port}`);
});
