const db = require("../utils/database");

module.exports = class Likes{

        constructor(userId=null, postId=null){
              this.userId = userId;
              this.postId = postId;  
        }


        getLikes(){
            const query = `
              SELECT postId FROM Likes WHERE postId=? and userId=?
            `;
            return db.query(query , [this.postId , this.userId]);
        }
  
        async addLikes(){
          const sql = await db.getConnection();
          try {
              await sql.beginTransaction();
              await sql.query('INSERT INTO Likes (userId , postId) VALUES (? , ?);' , [this.userId , this.postId]);
              await sql.query('UPDATE Posts SET post_likeCount = post_likeCount+1 WHERE postID = ?;' , [this.postId]);
              await sql.commit();
              return sql.release();
          } catch (e) {
            console.log("ADD LIKES " ,e);
            await  sql.rollback();
            return sql.release();
          }
        }
        async deleteLikes(){
          const sql = await db.getConnection();
          try {
              await sql.beginTransaction();
              await sql.query('DELETE FROM Likes WHERE postId=? and userId=?;' , [this.postId , this.userId]);
              await sql.query('UPDATE Posts SET post_likeCount = post_likeCount-1 WHERE postID = ?;' , [this.postId]);
              await sql.commit();
              return sql.release();
          } catch (e) {
              console.log("DELETE LIKES " , e);
              await sql.rollback();
              return sql.release();
          }
  
        }

}