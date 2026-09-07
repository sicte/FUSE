const db = require('./db');

async function Get(userId, postId, pageNumber, pageSize) {
    const totalResult = await db.query(`SELECT COUNT(*) FROM comments 
        WHERE post_id = $1 AND (deactivation IS NULL OR deactivation = '')`, [postId]);

    const totalComments = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalComments / pageSize);

    let comments = [];

    if (pageNumber < totalPages) {

        const res = await db.query(`
            SELECT comments.id, comments.comment, comments.created_at, users.username, users.image_url AS user_image_url,
            CASE WHEN comments.user_id = $4 THEN true ELSE false END AS "isUserComment"
            FROM comments
            JOIN users ON users.id = comments.user_id
            WHERE comments.post_id = $1 AND (comments.deactivation IS NULL OR comments.deactivation = '')
            ORDER BY comments.created_at DESC
            LIMIT $2 OFFSET $3;`, [postId, pageSize, pageNumber * pageSize, userId]);

        comments = res.rows;
    }

    return {
        comments: comments,
        currPage: pageNumber + 1,
        totalPages: totalPages
    }
}

async function GetAllComments(postId) {
    const res = await db.query(`
        SELECT 
            comments.id AS "id",
            comments.user_id AS "userId",
            users.username AS "username",
            comments.comment AS "comment",
            comments.created_at AS "created_at"
        FROM comments
        JOIN users 
            ON users.id = comments.user_id
        WHERE comments.post_id = $1
        AND (comments.deactivation IS NULL OR comments.deactivation = '')
        ORDER BY comments.created_at DESC
    `, [postId]);

    return res.rows;
}

async function Add(userId, postId, comment, created_at) {
    await db.query(`INSERT INTO comments (post_id, user_id, comment, created_at) VALUES ($1, $2, $3, $4)`, [postId, userId, comment, created_at]);
}

async function Delete(commentId) {
    await db.query(`UPDATE comments SET deactivation = 'Deleted' WHERE id = $1`, [commentId]);
}


module.exports = { Get, Add, Delete, GetAllComments };