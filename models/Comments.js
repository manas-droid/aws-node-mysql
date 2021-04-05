const db = require("../utils/database");


module.exports = class Comment{

      constructor(postId=null,userId=null,parentId=null,body=null){
          this.postId = postId;
          this.userId = userId;
          this.parentId = parentId;
          this.body = body;
      }

      async createComment(){
          try {
              await db.query("START TRANSACTION;");
              await db.query("INSERT INTO Comments (postId, userId , text_comment , parentId) VALUES (? , ? , ? , ?);", [this.postId , this.userId , this.body , this.parentId]);
              await db.query('UPDATE Posts SET post_commentCount = post_commentCount+1 WHERE postID = ?' , [this.postId]);
              return db.query("COMMIT;");
          } catch (e) {
            console.log("ROLLBACK: ", e);
            return db.query("ROLLBACK;");
          }
      }

      getComments(){
        const query = `
          SELECT text_comment as comment , username,commentId  FROM Comments as c , Users as u WHERE c.userId = u.userId and postId = ?;
        `;
        return db.query(query , [this.postId]);
      }

};
