const db = require('./db');

async function Search(userId, pageNumber, pageSize) {
    const countResult = await db.query(
        `SELECT COUNT(DISTINCT CASE 
            WHEN sender_id = $1 THEN receiver_id
            ELSE sender_id
         END)
         FROM messages
         WHERE sender_id = $1 OR receiver_id = $1;`,
        [userId]
    );

    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / pageSize);

    let messages = [];

    if (pageNumber < totalPages) {
        const result = await db.query(
            `WITH latest_messages AS (
                SELECT DISTINCT ON (
                    CASE 
                        WHEN m.sender_id = $1 THEN m.receiver_id
                        ELSE m.sender_id
                    END
                )
                CASE 
                    WHEN m.sender_id = $1 THEN m.receiver_id
                    ELSE m.sender_id
                END AS other_user_id,
                m.* 
                FROM messages m
                WHERE m.sender_id = $1 OR m.receiver_id = $1
                ORDER BY 
                    CASE 
                        WHEN m.sender_id = $1 THEN m.receiver_id
                        ELSE m.sender_id
                    END,
                    m.created_at DESC
            )
            SELECT 
                u.id AS "sender_id",
                u.username AS "sender_username",
                u.image_url AS "sender_image_url",
                lm.message,
                lm.created_at
            FROM latest_messages lm
            JOIN users u ON u.id = lm.other_user_id
            ORDER BY lm.created_at DESC
            LIMIT $2 OFFSET $3;`,
            [userId, pageSize, pageNumber * pageSize]
        );

        messages = result.rows;
    }

    return {
        messages,
        currPage: pageNumber + 1,
        totalPages
    };
}

async function GetMessage(currUserId, userId, pageNumber, pageSize) {
    const countResult = await db.query(
        `
        SELECT COUNT(*) FROM messages
        WHERE 
            (sender_id = $1 AND receiver_id = $2)
            OR
            (sender_id = $2 AND receiver_id = $1)
        `,
        [currUserId, userId]
    );

    const totalMessages = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalMessages / pageSize);

    let messages = [];

    if (pageNumber < totalPages) {
        const result = await db.query(
            `
            SELECT 
                id,
                message,
                media_url,
                created_at,
                sender_id,
                receiver_id
            FROM messages
            WHERE 
                (sender_id = $1 AND receiver_id = $2)
                OR
                (sender_id = $2 AND receiver_id = $1)
            ORDER BY created_at DESC
            LIMIT $3 OFFSET $4
            `,
            [currUserId, userId, pageSize, pageNumber * pageSize]
        );

        messages = result.rows;
    }

    return {
        messages,
        currPage: pageNumber + 1,
        totalPages
    };
}

async function StoreMessage(sender_id, receiver_id, message, media_url, created_at) {
    await db.query(
        `INSERT INTO messages (sender_id, receiver_id, message, media_url, created_at) 
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id;`,
        [sender_id, receiver_id, message, media_url, created_at]
    );
}

module.exports = { Search, GetMessage, StoreMessage };