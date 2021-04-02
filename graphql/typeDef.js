
const {gql} = require("apollo-server-express");


module.exports = gql`

type User{
  email    : String!,
  username : String!,
  userId : String!
}

type Query{
  helloWorld: String!
  authMe: Int
}
type Mutation{
  register(email:String! , username:String! , password:String!) : Boolean!
  login(email:String! , password:String!): Boolean!
}
`;
