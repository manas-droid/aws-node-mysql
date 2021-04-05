
const {gql} = require("apollo-server-express");


module.exports = gql`

type S3Payload{
  signedRequest: String!
  url: String!
}

input inputPost{
  imageUrl : String
  description:String!
  bookname:String!
}
type Post{
  id :Int!
  imageUrl : String
  description:String!
  bookname:String!
  username:String!
}
type SinglePost{
  id :Int!
  imageUrl : String
  description:String!
  bookname:String!
  username:String!
  commentCount:Int!
}

type Comment{
  commentId:Int!
  comment:String!
  username:String!
}

type Query{
  helloWorld: String!
  authMe: Int
  getAllPosts:[Post!]
  test : Boolean!
  getLikes(postId:Int!):Boolean!
  getBookMarks(postId:Int!):Boolean!
  getSinglePost(postId:Int!):SinglePost!
  getComments(postId:Int!):[Comment]!
}


type Mutation{
  register(email:String! , username:String! , password:String!) : Boolean!
  login(email:String! , password:String!): Boolean!
  s3Signature(filename:String! , filetype:String!):S3Payload!
  createPost(input:inputPost): Boolean!
  addBookMark(postId:Int!):Boolean!
  addLikes(postId:Int!):Boolean!
  addPostComment(postId:Int! parentId:Int comment:String!): Boolean!
}
`;
