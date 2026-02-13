const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Initialize visitor count table
const initVisitorCount = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS visitor_count (
                id SERIAL PRIMARY KEY,
                count INTEGER DEFAULT 0
            );
        `);
        // Ensure one row exists
        const result = await db.query('SELECT * FROM visitor_count');
        if (result.rows.length === 0) {
            await db.query('INSERT INTO visitor_count (count) VALUES (0)');
        }
    } catch (error) {
        console.error('Error initializing visitor count:', error);
    }
};

initVisitorCount();

// POST /api/visit - Increment visitor count
router.post('/visit', async (req, res) => {
    try {
        await db.query('UPDATE visitor_count SET count = count + 1 WHERE id = 1');
        res.json({ message: 'Visit recorded' });
    } catch (error) {
        console.error('Error recording visit:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/sliders - Get active sliders
router.get('/sliders', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM sliders WHERE is_active = true ORDER BY position ASC'
        );

        // If no sliders in database, return default fallback slides
        if (result.rows.length === 0) {
            return res.json([
                {
                    id: 1,
                    title: 'Excellence in Surgical Instruments',
                    subtitle: 'Shahraj Exporter',
                    description: 'Your trusted partner for premium quality surgical instruments worldwide',
                    image_url: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccf?w=1920&q=80',
                    cta_text: 'Explore Products',
                },
                {
                    id: 2,
                    title: 'Precision Engineering for Medical Excellence',
                    subtitle: 'Medical Grade Quality',
                    description: 'ISO certified surgical instruments manufactured to the highest international standards',
                    image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80',
                    cta_text: 'Learn More',
                },
                {
                    id: 3,
                    title: 'Global Trust, Local Service',
                    subtitle: 'Exporting to 70+ Countries',
                    description: 'Delivering premium surgical instruments to healthcare professionals worldwide',
                    image_url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1920&q=80',
                    cta_text: 'Contact Us',
                },
            ]);
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sliders:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/categories - Get all categories
router.get('/categories', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/categories/:id/products - Get products by category
router.get('/categories/:id/products', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT * FROM products WHERE category_id = $1 AND is_active = true ORDER BY name ASC',
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/about - Get about page content
router.get('/about', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM about_us WHERE id = 1');

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'About content not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching about content:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/contact - Get contact information
router.get('/contact', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM contact_info WHERE id = 1');

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contact info not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching contact info:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/specializations - Get we-specialize-in items
router.get('/specializations', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM we_specialize_in ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching specializations:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/instruments - Get surgical instruments showcase
router.get('/instruments', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM our_surgical_instruments ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching instruments:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/stats - Get stats section
router.get('/stats', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM stats_section ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/quotes - Submit quote request
router.post('/quotes', async (req, res) => {
    try {
        const { name, email, phone, company, product_interest, quantity, message } = req.body;

        // Validation
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const result = await db.query(
            `INSERT INTO quotes (name, email, phone, company, product_interest, quantity, message, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
             RETURNING *`,
            [name, email, phone, company, product_interest, quantity, message]
        );

        res.status(201).json({
            message: 'Quote request submitted successfully',
            quote: result.rows[0]
        });
    } catch (error) {
        console.error('Error submitting quote:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/settings - Get public website settings
router.get('/settings', async (req, res) => {
    try {
        const result = await db.query('SELECT website_name, theme_color, copyright_text FROM super_admin_settings WHERE id = 1');

        if (result.rows.length === 0) {
            return res.json({
                website_name: 'Shahraj Exporter',
                theme_color: '#0066cc',
                copyright_text: 'Shahraj Exporter. All Rights Reserved.'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
