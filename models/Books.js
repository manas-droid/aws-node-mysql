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
          return db.execute(query , [this.description , this.bookname , this.imageUrl , this.authorId]);
      }

      getPosts(){
        const query = `
        SELECT  postID as id,post_summary as description,
        post_bookname as bookname ,post_image as imageUrl , username
        FROM Posts as p , Users as u
        WHERE p.post_authorID = u.userId;
        `;
        return db.execute(query);
      }

      getBookMark(userId , postId){
          const query = `
          SELECT postId FROM BookMark WHERE postId = ? and userId = ?
          `;
          return db.execute(query , [postId , userId]);
      }

      addBookMark(userId , postId){
          const query = `
          INSERT INTO BookMark(userId , postId) VALUES (? , ?)
          `
          return db.execute(query , [userId , postId]);
      }

      deleteBookMark(userId,postId){
          const query = `
            DELETE FROM BookMark WHERE userId = ? and postId=?
          `;
          return db.execute(query , [userId , postId]);
      }

      getLikes(userId , postId){
          const query = `
            SELECT postId FROM Likes WHERE postId=? and userId=?
          `;
          return db.execute(query , [postId , userId]);
      }

      async addLikes(userId , postId){
        try {
            await db.query('START TRANSACTION;');
            await db.query('INSERT INTO LIKES(userId , postId) VALUES (? , ?);' , [userId , postId]);
            await db.query('UPDATE Posts SET post_likeCount = post_likeCount+1 WHERE postID = ?;' , [postId]);
            return db.query('COMMIT;');
        } catch (e) {
          console.log(e);
          return db.query('ROLLBACK;');
        }
      }

      async deleteLikes(userId , postId){
        try {
            await db.query('START TRANSACTION;');
            await db.query('DELETE FROM LIKES WHERE postId=? and userId=?;' , [postId , userId]);
            await db.query('UPDATE Posts SET post_likeCount = post_likeCount-1 WHERE postID = ?;' , [postId]);
            return db.query('COMMIT;');
        } catch (e) {
            console.log(e);
            return db.query('ROLLBACK;');
        }

      }

      getSinglePost(postId){
        const query = `
        SELECT  postID as id,post_summary as description,
        post_commentCount as commentCount,
        post_bookname as bookname ,post_image as imageUrl , username
        FROM Posts as p , Users as u
        WHERE p.post_authorID = u.userId and postID = ?;
        `;
        return db.query(query , [postId]);
      }

}
