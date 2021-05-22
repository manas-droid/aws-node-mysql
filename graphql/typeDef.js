
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
  nickname:String!
  likeCount:Int!
}

type SinglePost{
  id :Int!
  imageUrl : String
  description:String!
  bookname:String!
  nickname:String!
  commentCount:Int!
}

type Comment{
  commentId:Int!
  comment:String!
  nickname:String
  picture:String
}

type Error{
  path:String!
  message:String
}

type Response{
  ok:Boolean!
  errors:[Error!]
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
  getYourBookMarks:[Post]! 
  getYourPosts : [Post]!
}



type Mutation{
  s3Signature(filename:String! , filetype:String!):S3Payload!
  createPost(input:inputPost):Response!
  addBookMark(postId:Int!):Response!
  addLikes(postId:Int!):Response!
  addPostComment(postId:Int! parentId:Int comment:String!): Response!
  deleteYourPosts(postId:Int!):Response!
  deleteComment(commentId:Int! postId:Int!):Response!
}
`;
