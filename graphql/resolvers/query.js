const BookMarks = require("../../models/BookMarks.js");
const Post = require("../../models/Books.js");
const Comment = require("../../models/Comments.js");
const Likes = require("../../models/Likes.js");


module.exports = {
Query : {
      helloWorld : (_ , __ )=>{
        return "Hello World";
      },
      authMe : (_ , __ , {req})=>{
          return req.session.userId;
      },
      getAllPosts : async (_ , __)=>{
        try {
            const book = new Post();
            const [books , ___] = await book.getPosts();
            return books;
        } catch (e) {
            throw new Error(e);
        }
      },
      getBookMarks : async(_ ,{postId},{req})=>{
        const userId = req.session.userId;
        if(userId){
          try {
            const book = new BookMarks(userId , postId);
            const[check , __] = await book.getBookMark();
            return check.length>0;
          } catch (e) {
            throw new Error(e);
          }
        }
        return false;
      },
      getLikes : async (_ , {postId} , {req})=>{
        const userId = req.session.userId;
        if(userId){
            try {
              const book = new Likes(userId , postId);
              const [check , __] = await book.getLikes();
              return check.length > 0;
            } catch (e) {
                throw new Error(e);
            }
        }
        else
            throw new Error("User not authorised");
      },
      getSinglePost : async (_ , {postId})=>{
          try {
              const book = new Post();
              const [result] = await book.getSinglePost(postId);
              return result[0];
          } catch (e) {
              throw new Error(e);
          }
      },
      getComments : async(_ , {postId})=>{
          try {
            const comment = new Comment(postId);
            const[ result , __] = await comment.getComments();
            return result;
          } catch (e) {
            throw new Error(e);
          }
      },
      getYourBookMarks : async (_ , __ , {req})=>{
          try {
            const userId = req.session.userId;
              if(userId){
                  const book = new BookMarks(userId);
                  const [result] = await book.getYourBookMarks();
                  return result;
              }else{
              throw new Error("User not authorised");
              }
          } catch (error) {
            throw new Error(error);
          }
      },

      getYourPosts : async (_ , __ , {req})=>{
            const userId = req.session.userId;
            if (userId) {
              try {
                const book = new Post();
                const [result] = await book.getYourPosts(userId);
                return result;
              } catch (error) {
                throw new Error(error);
              }
            } 
            else {
              throw new Error("User not authorised to get YOur Post");
            }
          
      }
}
};
