const db = require('./db');

async function CreateUser(email) {
    const now = new Date();
    await db.query('INSERT INTO users (email, created_at) VALUES ($1, $2)', [email, now]);
    return await GetUserByEmail(email);
}

async function GetUser(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

async function GetUserByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

async function GetUserByUsername(username) {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
}

async function UpdateUser(fields, index, values) {
    const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING *;`;

    const result = await db.query(query, values);
    return result.rows[0];
}

async function Search(userId, term, pageNumber, pageSize) {
    const searchTerm = `%${term}%`;

    const totalResult = await db.query(`
        SELECT COUNT(*) FROM users 
        WHERE (deactivation IS NULL OR deactivation = '') 
        AND username ILIKE $1
        AND id != $2;`, [searchTerm, userId]);
    const totalPosts = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / pageSize);

    let messages = [];

    if (pageNumber < totalPages) {
        const res = await db.query(
            `SELECT id AS "sender_id", username AS "sender_username", image_url AS "sender_image_url" FROM users
            WHERE (deactivation IS NULL OR deactivation = '')
            AND username ILIKE $1
            AND id != $4
            ORDER BY username
            LIMIT $2 OFFSET $3;`,
            [searchTerm, pageSize, pageNumber * pageSize, userId]
        );

        messages = res.rows;
    }

    return {
        messages,
        currPage: pageNumber + 1,
        totalPages
    };
}

module.exports = { CreateUser, GetUser, GetUserByEmail, GetUserByUsername, UpdateUser, Search };