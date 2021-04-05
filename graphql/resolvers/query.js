const Post = require("../../models/Books.js");
const Comment = require("../../models/Comments.js");


module.exports = {
Query : {
      helloWorld : (_ , __ , context)=>{
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
            const book = new Post();
            const[check , __] = await book.getBookMark(userId , postId);
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
              const book = new Post();
              const [check , __] = await book.getLikes(userId , postId);
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
              console.log(result);
              return result[0];
          } catch (e) {
              throw new Error(e);
          }
      },
      getComments : async(_ , {postId})=>{
          try {
            const comment = new Comment(postId);
            const[ result , __] = await comment.getComments();
            console.log(result);
            return result;
          } catch (e) {
            throw new Error(e);
          }
      }
}
}
