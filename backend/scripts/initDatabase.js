const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'pharma_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

async function initializeDatabase() {
    const client = await pool.connect();

    try {
        console.log('🔄 Starting database initialization...\n');

        // Read and execute schema file
        console.log('📝 Reading schema file...');
        const schemaPath = path.join(__dirname, '..', 'schema.sql');
        let schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Generate password hashes
        console.log('🔐 Generating password hashes...');
        const adminPasswordHash = await bcrypt.hash('admin123', 10);
        const superAdminPasswordHash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123', 10);

        console.log('   Admin password: admin123');
        console.log('   Super admin password:', process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123');

        // Replace placeholder hashes in SQL
        schemaSql = schemaSql.replace(
            /\$2b\$10\$placeholder_hash_will_be_generated/g,
            (match, offset) => {
                // First occurrence is super admin, second is admin
                const firstOccurrence = schemaSql.indexOf('$2b$10$placeholder_hash_will_be_generated');
                return offset === firstOccurrence ? superAdminPasswordHash : adminPasswordHash;
            }
        );

        // Execute schema if tables don't exist
        console.log('🗄️  Creating tables and inserting seed data (if needed)...');
        await client.query(schemaSql);

        // Explicitly update passwords to ensure valid hashes
        console.log('🔐 Updating admin passwords to ensure validity...');
        await client.query('UPDATE admins SET password_hash = $1 WHERE username = $2', [adminPasswordHash, 'admin']);
        await client.query('UPDATE super_admin_settings SET super_password_hash = $1 WHERE id = 1', [superAdminPasswordHash]);

        // Verify data
        console.log('\n✅ Database initialized successfully!\n');
        console.log('📊 Data Summary:');

        const counts = await client.query(`
            SELECT 'categories' as table_name, COUNT(*) as count FROM categories
            UNION ALL
            SELECT 'products', COUNT(*) FROM products
            UNION ALL
            SELECT 'sliders', COUNT(*) FROM sliders
            UNION ALL
            SELECT 'we_specialize_in', COUNT(*) FROM we_specialize_in
            UNION ALL
            SELECT 'our_surgical_instruments', COUNT(*) FROM our_surgical_instruments
            UNION ALL
            SELECT 'stats_section', COUNT(*) FROM stats_section
            UNION ALL
            SELECT 'about_us', COUNT(*) FROM about_us
            UNION ALL
            SELECT 'contact_info', COUNT(*) FROM contact_info
            UNION ALL
            SELECT 'admins', COUNT(*) FROM admins
            UNION ALL
            SELECT 'super_admin_settings', COUNT(*) FROM super_admin_settings
        `);

        counts.rows.forEach(row => {
            console.log(`   ${row.table_name}: ${row.count} records`);
        });

        console.log('\n🎉 All static content has been migrated to PostgreSQL!\n');
        console.log('📋 Default Credentials:');
        console.log('   Admin Username: admin');
        console.log('   Admin Password: admin123');
        console.log('   Super Admin Password:', process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123');
        console.log('\n⚠️  Remember to change these passwords in production!\n');

    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        console.error('\n🔍 Troubleshooting:');
        console.error('   1. Make sure PostgreSQL is running');
        console.error('   2. Check your .env file has correct database credentials');
        console.error('   3. Ensure the database exists: createdb pharma_db');
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

initializeDatabase();
