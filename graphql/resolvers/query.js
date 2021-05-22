const BookMarks = require("../../models/BookMarks.js");
const Post = require("../../models/Books.js");
const Comment = require("../../models/Comments.js");
const Likes = require("../../models/Likes.js");


module.exports = {
Query : {
      getAllPosts : async (_ , __)=>{
        try {
            const book = new Post();
            const [books , ___] = await book.getPosts();
            console.log(books);
            return books;
        } catch (e) {
            throw new Error(e);
        }
      },
      getBookMarks : async(_ ,{postId},{user})=>{
        if(user){
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
      getLikes : async (_ , {postId} , {user})=>{
        if(user){
            try {
              const book = new Likes(user , postId);
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
      getYourBookMarks : async (_ , __ , {user})=>{
          try {
              if(user){
                  const book = new BookMarks(user);
                  const [result] = await book.getYourBookMarks();
                  return result;
              }else{
              throw new Error("User not authorised");
              }
          } catch (error) {
            throw new Error(error);
          }
      },
      
      getYourPosts : async (_ , __ , {user})=>{
            if (user) {
              try {
                const book = new Post();
                const [result] = await book.getYourPosts(user);
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
