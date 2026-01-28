const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { verifySuperAdmin, verifyAdmin } = require('../middleware/auth');

// POST /api/super-admin/verify - Verify super admin password (standalone endpoint)
router.post('/verify', verifySuperAdmin, (req, res) => {
    res.json({ message: 'Super admin verified successfully' });
});

// GET /api/super-admin/settings - Get website settings
// Only requires standard admin token because these settings are visible publicly anyway
router.get('/settings', verifyAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM super_admin_settings WHERE id = 1');

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Settings not found' });
        }

        // Don't send password hash to client
        const { super_password_hash, ...settings } = result.rows[0];
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// All routes below require super admin PASSWORD verification
router.use(verifySuperAdmin);

// PUT /api/super-admin/settings - Update website settings
router.put('/settings', async (req, res) => {
    try {
        const { website_name, theme_color, copyright_text } = req.body;

        const result = await db.query(
            `UPDATE super_admin_settings 
             SET website_name = COALESCE($1, website_name),
                 theme_color = COALESCE($2, theme_color),
                 copyright_text = COALESCE($3, copyright_text),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = 1
             RETURNING *`,
            [website_name, theme_color, copyright_text]
        );

        // Don't send password hash to client
        const { super_password_hash, ...settings } = result.rows[0];
        res.json(settings);
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/super-admin/password - Update super admin password
router.put('/password', async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        await db.query(
            'UPDATE super_admin_settings SET super_password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
            [newPasswordHash]
        );

        res.json({ message: 'Super admin password updated successfully' });
    } catch (error) {
        console.error('Error updating super admin password:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/super-admin/products - Create product (bypasses 5-product limit)
router.post('/products', async (req, res) => {
    try {
        const { category_id, name, description, image_url, icon, is_active } = req.body;

        if (!category_id || !name) {
            return res.status(400).json({ error: 'Category and name are required' });
        }

        // Disable trigger temporarily to bypass limit
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('ALTER TABLE products DISABLE TRIGGER enforce_product_limit');

            const result = await client.query(
                `INSERT INTO products (category_id, name, description, image_url, icon, is_active)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [category_id, name, description, image_url, icon, is_active !== false]
            );

            await client.query('ALTER TABLE products ENABLE TRIGGER enforce_product_limit');
            await client.query('COMMIT');

            res.status(201).json({
                message: 'Product created with super admin override',
                product: result.rows[0]
            });
        } catch (error) {
            await client.query('ROLLBACK');
            await client.query('ALTER TABLE products ENABLE TRIGGER enforce_product_limit');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error creating product (super admin):', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
