const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { verifySuperAdmin, verifyAdmin, verifySuperAdminToken } = require('../middleware/auth');

// ============================================================================
// SUPER ADMIN LOGIN
// ============================================================================

// POST /api/superadmin/login - Super Admin authentication
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Get super admin from database
        const result = await db.query('SELECT * FROM super_admins WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const superAdmin = result.rows[0];

        // Verify password
        const isValid = await bcrypt.compare(password, superAdmin.password_hash);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token with role
        const token = jwt.sign(
            {
                id: superAdmin.id,
                username: superAdmin.username,
                role: 'superadmin'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            superAdmin: {
                id: superAdmin.id,
                username: superAdmin.username,
                email: superAdmin.email
            }
        });
    } catch (error) {
        console.error('Super admin login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================================================
// LEGACY PASSWORD-BASED VERIFICATION (for old settings page)
// ============================================================================

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

// PUT /api/super-admin/settings - Update website settings (JWT-based)
router.put('/settings', verifySuperAdminToken, async (req, res) => {
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

// POST /api/superadmin/change-password - Change super admin password (JWT-based)
router.post('/change-password', verifySuperAdminToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        // Get current super admin
        const result = await db.query('SELECT * FROM super_admins WHERE id = $1', [req.superAdminId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Super admin not found' });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Update password
        const newHash = await bcrypt.hash(newPassword, 10);
        await db.query(
            'UPDATE super_admins SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [newHash, req.superAdminId]
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing super admin password:', error);
        res.status(500).json({ error: 'Server error' });
    }
});




// ============================================================================
// ADMIN MANAGEMENT (JWT-based authentication)
// ============================================================================

// GET /api/superadmin/admins - List all admins
router.get('/admins', verifySuperAdminToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, username, created_at 
            FROM admins 
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/superadmin/admins - Create new admin
router.post('/admins', verifySuperAdminToken, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if username already exists
        const existingAdmin = await db.query('SELECT id FROM admins WHERE username = $1', [username]);

        if (existingAdmin.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert new admin
        const result = await db.query(
            'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
            [username, passwordHash]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/superadmin/admins/:id - Update admin
router.put('/admins/:id', verifySuperAdminToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Check if new username is already taken by another admin
        const existingAdmin = await db.query(
            'SELECT id FROM admins WHERE username = $1 AND id != $2',
            [username, id]
        );

        if (existingAdmin.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const result = await db.query(
            'UPDATE admins SET username = $1 WHERE id = $2 RETURNING id, username, created_at',
            [username, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/superadmin/admins/:id - Delete admin
router.delete('/admins/:id', verifySuperAdminToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM admins WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/superadmin/admins/:id/reset-password - Reset admin password (no old password required)
router.post('/admins/:id/reset-password', verifySuperAdminToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ error: 'New password is required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        const result = await db.query(
            'UPDATE admins SET password_hash = $1 WHERE id = $2 RETURNING id',
            [passwordHash, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
