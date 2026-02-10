const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { verifyAdmin } = require('../middleware/auth');

// POST /api/admin/login - Admin authentication
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Get admin from database
        const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const admin = result.rows[0];

        // Verify password
        const isValid = await bcrypt.compare(password, admin.password_hash);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin.id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/admin/change-password - Change admin password
router.post('/change-password', verifyAdmin, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Old password and new password are required' });
        }

        // Validate new password strength
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        // Get current admin from database
        const result = await db.query('SELECT * FROM admins WHERE id = $1', [req.adminId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const admin = result.rows[0];

        // Verify old password
        const isValid = await bcrypt.compare(oldPassword, admin.password_hash);

        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Update password in database
        await db.query(
            'UPDATE admins SET password_hash = $1 WHERE id = $2',
            [newPasswordHash, req.adminId]
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// All routes below require admin authentication
router.use(verifyAdmin);

// ============================================================================
// DASHBOARD STATS
// ============================================================================

router.get('/dashboard/stats', async (req, res) => {
    try {
        // Run queries in parallel
        const [products, categories, quotes, visits] = await Promise.all([
            db.query('SELECT COUNT(*) FROM products'),
            db.query('SELECT COUNT(*) FROM categories'),
            db.query("SELECT COUNT(*) FROM quotes WHERE status = 'pending' OR status = 'New'"), // Handle case variants
            db.query('SELECT count FROM visitor_count WHERE id = 1')
        ]);

        res.json({
            totalProducts: parseInt(products.rows[0].count),
            totalCategories: parseInt(categories.rows[0].count),
            pendingQuotes: parseInt(quotes.rows[0].count),
            totalVisits: visits.rows.length > 0 ? parseInt(visits.rows[0].count) : 0
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================================================
// PRODUCTS MANAGEMENT
// ============================================================================

// GET /api/admin/products - List all products
router.get('/products', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            ORDER BY c.name, p.name
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/admin/products - Create product (with 5-product limit)
router.post('/products', async (req, res) => {
    try {
        const { category_id, name, description, image_url, icon, is_active } = req.body;

        if (!category_id || !name) {
            return res.status(400).json({ error: 'Category and name are required' });
        }

        // Check product count for this category
        const countResult = await db.query(
            'SELECT COUNT(*) as count FROM products WHERE category_id = $1 AND is_active = true',
            [category_id]
        );

        if (parseInt(countResult.rows[0].count) >= 5) {
            return res.status(403).json({
                error: 'Cannot add more than 5 products per category without super admin approval',
                limit_reached: true
            });
        }

        const result = await db.query(
            `INSERT INTO products (category_id, name, description, image_url, icon, is_active)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [category_id, name, description, image_url, icon, is_active !== false]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, name, description, image_url, icon, is_active } = req.body;

        const result = await db.query(
            `UPDATE products 
             SET category_id = COALESCE($1, category_id),
                 name = COALESCE($2, name),
                 description = COALESCE($3, description),
                 image_url = COALESCE($4, image_url),
                 icon = COALESCE($5, icon),
                 is_active = COALESCE($6, is_active)
             WHERE id = $7
             RETURNING *`,
            [category_id, name, description, image_url, icon, is_active, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================================================
// CATEGORIES MANAGEMENT
// ============================================================================

// GET /api/admin/categories - List all categories
router.get('/categories', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT c.*, COUNT(p.id) as product_count 
            FROM categories c 
            LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
            GROUP BY c.id 
            ORDER BY c.name
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/admin/categories - Create category
router.post('/categories', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const result = await db.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            [name]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/admin/categories/:id - Update category
router.put('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const result = await db.query(
            'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/admin/categories/:id - Delete category (will cascade delete products)
router.delete('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category has products
        const countResult = await db.query('SELECT COUNT(*) as count FROM products WHERE category_id = $1', [id]);

        if (parseInt(countResult.rows[0].count) > 0) {
            return res.status(400).json({
                error: 'Cannot delete category with existing products',
                product_count: countResult.rows[0].count
            });
        }

        const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================================================
// SLIDERS MANAGEMENT
// ============================================================================

// GET /api/admin/sliders - List all sliders
router.get('/sliders', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM sliders ORDER BY position ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sliders:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/admin/sliders - Create slider
router.post('/sliders', async (req, res) => {
    try {
        const { title, subtitle, description, image_url, cta_text, position, is_active } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const result = await db.query(
            `INSERT INTO sliders (title, subtitle, description, image_url, cta_text, position, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [title, subtitle, description, image_url, cta_text, position || 0, is_active !== false]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating slider:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/admin/sliders/:id - Update slider
router.put('/sliders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, description, image_url, cta_text, position, is_active } = req.body;

        const result = await db.query(
            `UPDATE sliders 
             SET title = COALESCE($1, title),
                 subtitle = COALESCE($2, subtitle),
                 description = COALESCE($3, description),
                 image_url = COALESCE($4, image_url),
                 cta_text = COALESCE($5, cta_text),
                 position = COALESCE($6, position),
                 is_active = COALESCE($7, is_active)
             WHERE id = $8
             RETURNING *`,
            [title, subtitle, description, image_url, cta_text, position, is_active, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Slider not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating slider:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/admin/sliders/reorder - Reorder sliders
router.put('/sliders/reorder', async (req, res) => {
    try {
        const { sliders } = req.body; // Array of { id, position }

        if (!Array.isArray(sliders)) {
            return res.status(400).json({ error: 'Sliders array is required' });
        }

        // Update positions in transaction
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            for (const slider of sliders) {
                await client.query(
                    'UPDATE sliders SET position = $1 WHERE id = $2',
                    [slider.position, slider.id]
                );
            }

            await client.query('COMMIT');
            res.json({ message: 'Sliders reordered successfully' });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error reordering sliders:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/admin/sliders/:id - Delete slider
router.delete('/sliders/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query('DELETE FROM sliders WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Slider not found' });
        }

        res.json({ message: 'Slider deleted successfully' });
    } catch (error) {
        console.error('Error deleting slider:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================================================
// CMS MANAGEMENT
// ============================================================================

// PUT /api/admin/cms/about - Update about content
router.put('/cms/about', async (req, res) => {
    try {
        const { content } = req.body;

        const result = await db.query(
            'UPDATE about_us SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = 1 RETURNING *',
            [content]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating about content:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/admin/cms/contact - Update contact info
router.put('/cms/contact', async (req, res) => {
    try {
        const { address, phone, email, business_hours, map_embed } = req.body;

        const result = await db.query(
            `UPDATE contact_info 
             SET address = COALESCE($1, address),
                 phone = COALESCE($2, phone),
                 email = COALESCE($3, email),
                 business_hours = COALESCE($4, business_hours),
                 map_embed = COALESCE($5, map_embed),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = 1
             RETURNING *`,
            [address, phone, email, business_hours, map_embed]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating contact info:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Specializations CRUD
router.get('/cms/specializations', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM we_specialize_in ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/cms/specializations', async (req, res) => {
    try {
        const { title, description, icon_url } = req.body;
        const result = await db.query(
            'INSERT INTO we_specialize_in (title, description, icon_url) VALUES ($1, $2, $3) RETURNING *',
            [title, description, icon_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/cms/specializations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, icon_url } = req.body;
        const result = await db.query(
            'UPDATE we_specialize_in SET title = COALESCE($1, title), description = COALESCE($2, description), icon_url = COALESCE($3, icon_url) WHERE id = $4 RETURNING *',
            [title, description, icon_url, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/cms/specializations/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM we_specialize_in WHERE id = $1', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Instruments CRUD
router.get('/cms/instruments', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM our_surgical_instruments ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/cms/instruments', async (req, res) => {
    try {
        const { title, description, icon_url } = req.body;
        const result = await db.query(
            'INSERT INTO our_surgical_instruments (title, description, icon_url) VALUES ($1, $2, $3) RETURNING *',
            [title, description, icon_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding instrument:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/cms/instruments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, icon_url } = req.body;
        const result = await db.query(
            'UPDATE our_surgical_instruments SET title = COALESCE($1, title), description = COALESCE($2, description), icon_url = COALESCE($3, icon_url) WHERE id = $4 RETURNING *',
            [title, description, icon_url, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating instrument:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/cms/instruments/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM our_surgical_instruments WHERE id = $1', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting instrument:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Stats CRUD
router.get('/cms/stats', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM stats_section ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/cms/stats', async (req, res) => {
    try {
        const { label, value, icon } = req.body;
        const result = await db.query(
            'INSERT INTO stats_section (label, value, icon) VALUES ($1, $2, $3) RETURNING *',
            [label, value, icon]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding stat:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/cms/stats/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { label, value, icon } = req.body;
        const result = await db.query(
            'UPDATE stats_section SET label = COALESCE($1, label), value = COALESCE($2, value), icon = COALESCE($3, icon) WHERE id = $4 RETURNING *',
            [label, value, icon, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating stat:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/cms/stats/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM stats_section WHERE id = $1', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting stat:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================================================
// QUOTES MANAGEMENT
// ============================================================================

// GET /api/admin/quotes - List quote requests
router.get('/quotes', async (req, res) => {
    try {
        const { status } = req.query;

        let query = 'SELECT * FROM quotes';
        let params = [];

        if (status) {
            query += ' WHERE status = $1';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/admin/quotes/:id/status - Update quote status
router.put('/quotes/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await db.query(
            'UPDATE quotes SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating quote status:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
