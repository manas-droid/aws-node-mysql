const db = require("../utils/database");
module.exports = class BookMarks{

    constructor (userId=null , postId=null){
        this.postId = postId;
        this.userId = userId;
    }

   async getBookMark(){
        const query = `
        SELECT postId FROM BookMark WHERE postId = ? and userId = ?
        `;
        const DML = await db.getConnection();
        const result = await DML.query(query , [this.postId , this.userId]);
        DML.release();
        return result;
    }

    async addBookMark(){

        const query = `
        INSERT INTO BookMark(userId , postId) VALUES (? , ?)
        `
        const DML = await db.getConnection();
        const result = await DML.query(query , [this.userId , this.postId]);
        DML.release();
        return result;
    }

    async deleteBookMark(){
        const query = `
          DELETE FROM BookMark WHERE userId = ? and postId=?
        `;
        const DML = await db.getConnection();
        const result = await DML.query(query , [this.userId , this.postId]);
        DML.release();
        return result;
    }

    async getYourBookMarks(){
      const query = `
      SELECT  p.postID as id, p.post_bookname as bookname,p.post_likeCount as likeCount, 
      p.post_image as imageUrl,p.post_summary as description 
      FROM Posts as p , BookMark as b 
      WHERE p.postID = b.postId and b.userId=?;
      `;

      const DML = await db.getConnection();
      const result = await DML.query(query , [this.userId]);
      DML.release();
      return result;
  }



}