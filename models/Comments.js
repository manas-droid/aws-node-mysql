const db = require("../utils/database");

module.exports = class Comment{

      constructor(postId=undefined,userId=undefined,parentId=undefined,body=undefined){
          this.postId = postId;
          this.userId = userId;
          this.parentId = parentId;
          this.body = body;
      }
      
      async createComment(){
        const sql = await db.getConnection();
        try {
              await sql.beginTransaction();
              await sql.query("INSERT INTO Comments (postId, userId , text_comment , parentId) VALUES (? , ? , ? , ?);", [this.postId , this.userId , this.body , this.parentId]);
              await sql.query('UPDATE Posts SET post_commentCount = post_commentCount+1 WHERE postID = ?' , [this.postId]);
              await sql.commit();
              return sql.release();
          } catch (e) {
            console.log("CREATE COMMENT ROLLBACK: ", e);
            await  sql.rollback();
            return sql.release();
          }
      }

      async deleteComment(commentId){
        const sql = await db.getConnection();
        try {
          await sql.beginTransaction();
          await sql.query("DELETE FROM Comments WHERE userId=? and commentId=?" , [this.userId,commentId]);
          await sql.query('UPDATE Posts SET post_commentCount = post_commentCount-1 WHERE postID = ?' , [this.postId]);
          await sql.commit();
          return sql.release();
        } catch (error) {
          console.log("DELETE COMMENT ROLLBACK: ", e);
          await sql.rollback();
          return sql.release();          
        }
      }

      getComments(){
        const query = `
          SELECT text_comment as comment , username,commentId  FROM Comments as c , Users as u WHERE c.userId = u.userId and postId = ?;
        `;
        return db.query(query , [this.postId]);
      }

};
