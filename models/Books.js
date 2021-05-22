const db = require("../utils/database");

module.exports = class Books{
      constructor(authorId=null , imageUrl=null , description=null , bookname=null){
          this.authorId = authorId;
          this.imageUrl = imageUrl;
          this.description = description;
          this.bookname = bookname;
      }

      createPost(){
          const query = `
              INSERT INTO Posts (post_summary , post_bookname , post_image , post_authorID) VALUES (?,?,?,?)
          `
          return db.query(query , [this.description , this.bookname , this.imageUrl , this.authorId]);
      }

      getPosts(){
        const query = `
        SELECT  postID as id,post_summary as description,
        post_bookname as bookname ,post_image as imageUrl , nickname , post_likeCount as likeCount
        FROM Posts as p , Users as u
        WHERE p.post_authorID = u.userId;
        `;
        return db.query(query);
      }


     
      getSinglePost(postId){
        const query = `
        SELECT  postID as id,post_summary as description,
        post_commentCount as commentCount,
        post_bookname as bookname ,post_image as imageUrl , nickname
        FROM Posts as p , Users as u
        WHERE p.post_authorID = u.userId and postID = ?;
        `;
        return db.query(query , [postId]);
      }

      
      getYourPosts(userId){
        const query = `
          SELECT  p.postID as id, p.post_bookname as bookname,p.post_likeCount as likeCount, 
          p.post_image as imageUrl,p.post_summary as description 
          FROM  Posts as p 
          WHERE p.post_authorID=?;
          `;
          
        return db.query(query , [userId]);
      }

      deleteYourPosts(postId){
        const query = `
          DELETE FROM Posts WHERE post_authorID = ? and postID = ?;
        `;
        return db.query(query , [this.authorId , postId]);
      }
}
