const resolvers = require('./graphql/resolvers/index.js');
const typeDefs = require('./graphql/typeDef');
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);

const SESSION_SECRET = "secret";
const {ApolloServer} =  require("apollo-server-express");

const options = {
      host: 'localhost',
      port: 3306,
      password: 'manas@904',
      database: 'book_blog',
      user : 'root',
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

const app = express();



app.use('/graphql', session({
  resave:true,
  name:"_gid",
  secret : SESSION_SECRET,
  saveUninitialized:false,
  cookie : {
    httpOnly : true,
    maxAge   : 7*24*60*60*1000
  },
  store : new MySqlStore(options)
}));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req })=>({req}),
});


server.applyMiddleware({app , path:'/graphql' })



app.listen({ port: 4000 }, () =>
console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);
