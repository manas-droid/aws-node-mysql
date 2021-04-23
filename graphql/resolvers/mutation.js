const argon = require('argon2');
const User = require("../../models/User.js");
const Post = require("../../models/Books.js");
const Comment = require("../../models/Comments.js");


const aws = require("aws-sdk");
const Likes = require('../../models/Likes.js');
const BookMarks = require('../../models/BookMarks.js');
require("dotenv").config();

module.exports = {
Mutation : {
      register : async(_ , {email,username,password})=>{
        let user;
        try {
          const hash = await argon.hash(password);
           user = new User(email , username , hash);
           await user.register();
        } catch (e) {
            throw new Error(e);
        }

        return true;
      } ,
      login : async(_ , {email , password} , {req})=>{
          const user  = new User(email);
          try {
            const findUser = await user.login();
            const resultUser = findUser[0][0];
            if(!resultUser){
              throw new Error("user not found");
            }

            const check = await argon.verify(resultUser.user_password , password);
            if(!check){
              throw new Error("password's incorrect");
            }
            req.session.userId = resultUser.userId;
          } catch (e) {
            throw new Error(e);
          }
          return true;
      },

      s3Signature: async (_ ,{filename , filetype} , {req})=>{

            const s3 = new aws.S3({
              accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
              secretAccessKey: process.env.AWS_BUCKET_SECRET,
              region : process.env.AWS_BUCKET_REGION
            });
            const s3Params = {
                      Bucket: process.env.AWS_BUCKET_NAME,
                      Key: filename,
                      Expires: 60,
                      ContentType: filetype,
                      ACL: 'public-read',
                    };

            const signedRequest = await s3.getSignedUrl('putObject', s3Params);
            const url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${filename}`;

            return{
            signedRequest ,
            url
            }

        },
        createPost : async (_ , {input:{imageUrl , description , bookname}} , {req})=>{
          const authorId = req.session.userId;
              if(authorId){
                try {
                  const book = new Post(authorId , imageUrl , description , bookname);
                  const result = await book.createPost();
                  return true;
                } catch (e) {
                    throw new Error(e);
                }
              }else{
                throw new Error("User not authenticated");
              }
              return false;
        },
        addBookMark : async (_ , {postId} , {req})=>{
          const userId = req.session.userId;
          if(userId){
            try {
              const book = new BookMarks(userId , postId);
              const[check , ___ ] = await book.getBookMark(userId , postId);
              if(check.length === 1){
                    await book.deleteBookMark(userId , postId);
                    return true;
              }
              await book.addBookMark(userId , postId);
              return true;

            } catch (e) {
              throw new Error(e);
            }
          }
          else
              throw new Error("User not authorised");
      },
      addLikes : async (_ , {postId} , {req})=>{
        const userId = req.session.userId;
        if(userId){
            try {
                const book = new Likes(userId , postId);
                const [check , __] = await book.getLikes();
                if(check.length === 1){
                 await book.deleteLikes();
                  return true;
                }
                await book.addLikes();
                return true;
            } catch (e) {
              throw new Error(e);
            }
        }
        else
          throw new Error("User not authorised");
      },

      addPostComment : async (_ , {postId , parentId , comment} , {req})=>{
        const userId = req.session.userId;
        if (userId) {
            try {
                const resultComment = new Comment(postId,userId,parentId,comment);
                 await resultComment.createComment();
                 return true;
            } catch (e) {
              throw new Error(e);
            }
        }
        else
            throw new Error("User not authorised");
      },
      deleteYourPosts : async (_ , {postId} , {req})=>{
        const userId = req.session.userId;
        if(userId){
            try {
              const book = new Post(userId);
              const result = await book.deleteYourPosts(postId);
              console.log(result);
            } catch (error) {
              throw new Error(error);
            }
            return true;
        }
        else
          throw new Error("User not authorised");  
      }
      ,
      deleteComment : async (_ , {postId , commentId} , {req})=>{
        const userId = req.session.userId;
        if(!userId) throw new Error("User not authorised");
        try {
          const comment = new Comment(postId , userId);
          await comment.deleteComment(commentId);
          return true;
        } catch (error) {
          throw new Error(error);
        }
      },
      logOut : async (_ , __ , {req})=>{
          const userId = req.session.userId;
          if(userId){
            req.session.destroy((err)=>{
                if(err)
                  throw new Error(err)
            });
            return true;
          }
         else 
            return false;
      }
}
}



/*
ADD LIKE :  [
  ResultSetHeader {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    info: '',
    serverStatus: 16386,
    warningStatus: 0,
    stateChanges: { systemVariables: {}, schema: null, trackStateChange: null }
  },
  undefined
]
*/
