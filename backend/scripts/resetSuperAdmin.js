const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'pharma_db',
    user: process.env.DB_USER || 'harikumarpatel',
    password: process.env.DB_PASSWORD || '',
});

async function resetPasswords() {
    const client = await pool.connect();
    try {
        console.log('🔄 Resetting passwords...');

        const adminHash = await bcrypt.hash('admin123', 10);
        const superAdminHash = await bcrypt.hash('SuperAdmin@123', 10);

        // Update Admin
        await client.query('UPDATE admins SET password_hash = $1 WHERE username = $2', [adminHash, 'admin']);
        console.log('✅ Admin password reset to: admin123');

        // Update Super Admin
        await client.query('UPDATE super_admin_settings SET super_password_hash = $1 WHERE id = 1', [superAdminHash]);
        console.log('✅ Super Admin password reset to: SuperAdmin@123');

    } catch (error) {
        console.error('❌ Error resetting passwords:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

resetPasswords();
