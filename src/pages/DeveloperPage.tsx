import './DeveloperPage.css';

const DeveloperPage = () => {
    return (
        <div className="developer-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="container">
                    <h1 className="page-title">Developer</h1>
                    <p className="page-subtitle">Building innovative solutions for the healthcare industry</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="developer-content-section">
                <div className="container">
                    <div className="developer-grid">
                        {/* About Developer */}
                        <div className="developer-info">
                            <h2>About This Project</h2>
                            <p className="developer-intro">
                                This platform was developed to streamline surgical instrument exports and provide
                                healthcare professionals worldwide with easy access to premium medical equipment.
                            </p>

                            <div className="tech-stack">
                                <h3>Technology Stack</h3>
                                <div className="tech-grid">
                                    <div className="tech-item">
                                        <div className="tech-icon">⚛️</div>
                                        <h4>React</h4>
                                        <p>Modern UI with TypeScript</p>
                                    </div>
                                    <div className="tech-item">
                                        <div className="tech-icon">🚀</div>
                                        <h4>Node.js</h4>
                                        <p>Scalable backend server</p>
                                    </div>
                                    <div className="tech-item">
                                        <div className="tech-icon">🐘</div>
                                        <h4>PostgreSQL</h4>
                                        <p>Robust database system</p>
                                    </div>
                                    <div className="tech-item">
                                        <div className="tech-icon">🎨</div>
                                        <h4>CSS3</h4>
                                        <p>Custom responsive design</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="developer-features">
                            <h2>Platform Features</h2>
                            <div className="features-list">
                                <div className="feature-card">
                                    <div className="feature-icon">🔐</div>
                                    <h4>Secure Admin Panel</h4>
                                    <p>Comprehensive content management system with role-based access control</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">📱</div>
                                    <h4>Responsive Design</h4>
                                    <p>Optimized for all devices from mobile to desktop</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">⚡</div>
                                    <h4>Dynamic CMS</h4>
                                    <p>Edit sliders, products, categories, and content in real-time</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">📊</div>
                                    <h4>Quote Management</h4>
                                    <p>Track and manage customer inquiries efficiently</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">🌍</div>
                                    <h4>Global Reach</h4>
                                    <p>Multilingual support and international shipping options</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">🔍</div>
                                    <h4>SEO Optimized</h4>
                                    <p>Built with best practices for search engine visibility</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Architecture */}
                    <div className="architecture-section">
                        <h2>System Architecture</h2>
                        <div className="architecture-grid">
                            <div className="arch-layer">
                                <h4>Frontend Layer</h4>
                                <ul>
                                    <li>React with TypeScript</li>
                                    <li>React Router for navigation</li>
                                    <li>Custom CSS with design system</li>
                                    <li>Responsive and accessible UI</li>
                                </ul>
                            </div>
                            <div className="arch-layer">
                                <h4>Backend Layer</h4>
                                <ul>
                                    <li>Node.js + Express server</li>
                                    <li>RESTful API architecture</li>
                                    <li>JWT authentication</li>
                                    <li>Data validation & security</li>
                                </ul>
                            </div>
                            <div className="arch-layer">
                                <h4>Database Layer</h4>
                                <ul>
                                    <li>PostgreSQL relational database</li>
                                    <li>Normalized schema design</li>
                                    <li>Indexed queries for performance</li>
                                    <li>Automated backups</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DeveloperPage;
