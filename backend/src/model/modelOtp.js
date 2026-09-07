const db = require('./db');

async function SetOtp(email, otp) {
    const now = new Date();
    const result = await db.query('SELECT id FROM otps WHERE email = $1', [email]);
    if (result.rows.length > 0) {
        await db.query(
            'UPDATE otps SET otp = $1, created_at = $2 WHERE email = $3',
            [otp, now, email]
        );
    } else {
        await db.query(
            'INSERT INTO otps (email, otp, created_at) VALUES ($1, $2, $3)',
            [email, otp, now]
        );
    }
}

async function VerifyOtp(email, otp) {
    const result = await db.query(
        'SELECT otp, created_at FROM otps WHERE email = $1',
        [email]
    );

    return result.rows[0];
}

module.exports = { SetOtp, VerifyOtp };