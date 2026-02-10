const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('🚀 Starting super admin migration...');

        // Read SQL file
        const sqlPath = path.join(__dirname, 'create_super_admins.sql');
        let sql = fs.readFileSync(sqlPath, 'utf-8');

        // Generate password hash for default super admin
        const defaultPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123';
        const passwordHash = await bcrypt.hash(defaultPassword, 10);

        // Replace placeholder with actual hash
        sql = sql.replace(
            '$2b$10$rH8qXwZYGQZ5vY0YqZ5WCeFqZ5WCeFqZ5WCeFqZ5WCeFqZ5WCeFqZ',
            passwordHash
        );

        await client.query('BEGIN');

        // Execute migration
        await client.query(sql);

        await client.query('COMMIT');

        console.log('✅ Super admins table created successfully');
        console.log('');
        console.log('📋 Default Super Admin Credentials:');
        console.log('   Username: superadmin');
        console.log('   Password:', defaultPassword);
        console.log('   Email: superadmin@srpharmagical.com');
        console.log('');
        console.log('⚠️  PLEASE CHANGE THE DEFAULT PASSWORD AFTER FIRST LOGIN!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration()
    .then(() => {
        console.log('Migration completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration error:', error);
        process.exit(1);
    });
