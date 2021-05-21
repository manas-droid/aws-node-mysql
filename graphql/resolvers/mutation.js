const argon = require('argon2');
const User = require("../../models/User.js");
const Post = require("../../models/Books.js");
const Comment = require("../../models/Comments.js");


const aws = require("aws-sdk");
const Likes = require('../../models/Likes.js');
const BookMarks = require('../../models/BookMarks.js');
require("dotenv").config();

const BASE_URL = "https://dev-qjkask69.us.auth0.com/";

function checkInputs(description, bookname){
    const errors = [];
    if(description.length <25){
      // use atleast 25 characters
      errors.push({path:'description' , message : 'The Description should be atleast 25 characters long'});
    }
    if(bookname.length === 0){
      // bookname not mentioned
      errors.push({path:'bookname' , message : 'bookname should be mentioned'});
    }
    if(errors.length >0){
      return {
        ok : false,
        errors 
      }
    }
}

module.exports = {
Mutation : {
      s3Signature: async (_ ,{filename , filetype} , {req})=>{
        //authorise
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
        createPost : async (_ , {input:{imageUrl , description , bookname}} , {req })=>{
        const authorId = req.session.userId;
        if(authorId){
          checkInputs(description , bookname);
          try {
            const book = new Post(authorId , imageUrl , description , bookname);
            await book.createPost();

            return {
              ok : true,
            }
          } catch (e) {

              return {
                ok : false,
                errors : [{path : 'unknown' , message : 'Something went wrong'}]
              };

          }
        }

          return {
            ok : false,
            errors : [{path : 'user' , message : 'User is not authenticated'}]
          };
        },
        addBookMark : async (_ , {postId} , {req})=>{
          const userId = req.session.userId;
          if(userId){
            try {
              const book = new BookMarks(userId , postId);
              const[check , ___ ] = await book.getBookMark(userId , postId);
              if(check.length === 1){
                    await book.deleteBookMark(userId , postId);
                    return {
                      ok:true
                    };
              }
              await book.addBookMark(userId , postId);
              return {
                ok : true,
              };

            } catch (e) {

              return {
                  ok:false,
                  errors : [{path : 'name' , message: 'Something went wrong'}]
              }

            }
          }
              return{
                ok:  false,
                errors : [{path:'user' , message: 'Username not Authorised'}]
              }
      },
      addLikes : async (_ , {postId} , {req})=>{
        const userId = req.session.userId;
        if(userId){
            try {
                const book = new Likes(userId , postId);
                const [check , __] = await book.getLikes();
                if(check.length === 1){
                 await book.deleteLikes();
                  return {
                    ok:true,
                  };
                }
                await book.addLikes();
                return {
                  ok : true
                };
            } catch (e) {
              return {
                ok:false,
                errors : [{path : 'name' , message: 'Something went wrong'}]
            }
            }
        }

          return{
            ok:  false,
            errors : [{path:'user' , message: 'Username not Authorised'}]
          }

      },
      addPostComment : async (_ , {postId , parentId , comment} , {req})=>{
        const userId = req.session.userId;
        if (userId) {
            if(comment.trim().length === 0){
              return {
                ok : false,
                errors : [{path : 'comment' , message : 'Comment should not be empty'}]
              }
            }
            try {
                const resultComment = new Comment(postId,userId,parentId,comment);
                 await resultComment.createComment();
                 return {
                   ok:true,
                 };
            } catch (e) {
              return {
                ok:false,
                errors : [{path : 'name' , message: 'Something went wrong'}]
            }
            }
        }
          return{
          ok:  false,
          errors : [{path:'user' , message: 'Username not Authorised'}]
        }
      },
      deleteYourPosts : async (_ , {postId} , {req})=>{
        const userId = req.session.userId;
        if(userId){
            try {
              const book = new Post(userId);
              const result = await book.deleteYourPosts(postId);
              console.log(result);
            } catch (error) {
               return {
                  ok:false,
                  errors : [{path : 'name' , message: 'Something went wrong'}]
              }
            }
            return {
              ok:true,
            };
        }
        return{
          ok:  false,
          errors : [{path:'user' , message: 'Username not Authorised'}]
        }
      }
      ,
      deleteComment : async (_ , {postId , commentId} , {req})=>{
        const userId = req.session.userId;
        if(!userId) {
          return {
            ok : false,
            errors : [{path:'user' , message: 'Username not Authorised'}]  
          };
        }
        try {
          const comment = new Comment(postId , userId);
          await comment.deleteComment(commentId);
          return {
            ok:true
          };
        } catch (error) {
          return {
            ok:false,
            errors : [{path : 'name' , message: 'Something went wrong'}]
        }
        }
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
