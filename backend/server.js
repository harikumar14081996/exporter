const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:4173',
            process.env.CORS_ORIGIN
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow Vercel deployments
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        if (allowedOrigins.indexOf(origin) !== -1 || !process.env.CORS_ORIGIN) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const superAdminRoutes = require('./routes/superAdmin');

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super-admin', superAdminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    // Temporary: Expose error details to frontend for debugging
    res.status(500).json({
        error: err.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏥 SR Pharmagical Exporter - Backend Server            ║
║                                                           ║
║   Status: ✅ Running                                      ║
║   Port: ${PORT}                                             ║
║   Environment: ${process.env.NODE_ENV || 'development'}                               ║
║                                                           ║
║   📡 API Endpoints:                                       ║
║   • Public: http://localhost:${PORT}/api                   ║
║   • Admin: http://localhost:${PORT}/api/admin              ║
║   • Super Admin: http://localhost:${PORT}/api/super-admin  ║
║                                                           ║
║   🔧 Health Check: http://localhost:${PORT}/health         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
        `);
    });
}

module.exports = app;
