const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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
    res.status(500).json({ error: 'Internal server error' });
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
