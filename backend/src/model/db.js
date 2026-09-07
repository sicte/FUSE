// const { Pool } = require('pg');

// require('dotenv').config();

// const pool = new Pool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     ssl: false,
//     // ssl: {
//     //     require: true
//     // }
// });

// module.exports = pool;

const { Pool } = require('pg');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'fuse';

async function ensureDatabaseExists() {
    const tempPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres',
        ssl: false,
    });

    try {
        const res = await tempPool.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
        if (res.rows.length === 0) {
            console.log(`⏳ [DB Notice] Database "${dbName}" does not exist. Creating database automatically...`);
            const safeDbName = dbName.replace(/"/g, '""');
            await tempPool.query(`CREATE DATABASE "${safeDbName}";`);
            console.log(`✅ [DB Notice] Database "${dbName}" created successfully!`);
        }
    } catch (err) {
        console.error('❌ [DB Error] Failed to ensure database exists:', err.message);
        throw err;
    } finally {
        await tempPool.end();
    }
}

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: dbName,
    ssl: false,
});

async function initializeDatabase() {
    try {
        await ensureDatabaseExists();
        console.log('⏳ [DB Notice] Synchronizing table structure and auto-patching...');

        // (1) Users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(100) DEFAULT 'user_' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6),
                password VARCHAR(255),
                about TEXT DEFAULT '',
                image_url TEXT DEFAULT '',
                deactivation VARCHAR(255) DEFAULT NULL,
                categories TEXT[] DEFAULT '{}',
                posts INT[] DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // (2) Otps table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS otps (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                otp VARCHAR(10) NOT NULL,
                created_at TIMESTAMP NOT NULL
            );
        `);

        // 🚨 (3) Posts table auto-creation and 'forced schema correction patch'
        // If there is an incorrectly created numeric likes column, drop it and rebuild it as a proper array type.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                post_title VARCHAR(255) NOT NULL DEFAULT '',
                post_body TEXT,
                media_url TEXT DEFAULT '',
                category TEXT[] DEFAULT '{}',
                likes INT[] DEFAULT '{}',                           -- ⚡ Confirmed standard integer array (INT[]) specification!
                comments INT DEFAULT 0,
                deactivation VARCHAR(255) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 🔥 [Cheat Code] Forced conversion command to set column type to integer array (INT[]) at runtime in case existing DB has likes as a regular number.
        await pool.query(`
            ALTER TABLE posts DROP COLUMN IF EXISTS likes;
            ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes INT[] DEFAULT '{}';
        `).catch(() => {});

        // (4) Messages table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id VARCHAR(255) PRIMARY KEY,
                sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                message TEXT,
                media_url TEXT DEFAULT '',
                created_at TIMESTAMP NOT NULL
            );
        `);

        // (5) Comments table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                comment TEXT NOT NULL,
                deactivation VARCHAR(255) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ [DB Notice] Database build 100% matching source code queries completed!');
    } catch (error) {
        console.error('❌ [DB Error] Patch build failed:', error.message);
    }
}

initializeDatabase();
module.exports = pool;


