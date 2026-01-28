const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/database');

// Middleware to verify admin JWT token
const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.id;
        req.adminUsername = decoded.username;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to verify super admin password
const verifySuperAdmin = async (req, res, next) => {
    try {
        const { superAdminPassword } = req.body;

        if (!superAdminPassword) {
            return res.status(400).json({ error: 'Super admin password required' });
        }

        // Get super admin password hash from database
        const result = await db.query('SELECT super_password_hash FROM super_admin_settings WHERE id = 1');

        if (result.rows.length === 0) {
            return res.status(500).json({ error: 'Super admin settings not found' });
        }

        const isValid = await bcrypt.compare(superAdminPassword, result.rows[0].super_password_hash);

        if (!isValid) {
            return res.status(403).json({ error: 'Invalid super admin password' });
        }

        next();
    } catch (error) {
        console.error('Super admin verification error:', error);
        return res.status(500).json({ error: 'Server error during verification' });
    }
};

module.exports = {
    verifyAdmin,
    verifySuperAdmin,
};
