import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import './Footer.css';

const Footer = () => {
    const [contact, setContact] = useState<any>(null);
    const [settings, setSettings] = useState<any>(null);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [contactData, settingsData] = await Promise.all([
                    apiService.getContact(),
                    apiService.getSettings()
                ]);
                setContact(contactData);
                setSettings(settingsData);
            } catch (error) {
                console.error('Error fetching footer data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Company Info */}
                        <div className="footer-column">
                            <h3 className="footer-title">{settings?.website_name || 'SR Pharmagical Exporter'}</h3>
                            <p className="footer-text">
                                Your trusted partner for premium quality surgical instruments worldwide.
                                We specialize in manufacturing and exporting medical-grade surgical tools
                                to healthcare professionals across the globe.
                            </p>
                            <div className="footer-certifications">
                                <span className="cert-badge">ISO Certified</span>
                                <span className="cert-badge">WHO GMP</span>
                                <span className="cert-badge">FDA Approved</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Quick Links</h4>
                            <ul className="footer-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><Link to="/get-quote">Get Quote</Link></li>
                                <li><Link to="/developer">Developer</Link></li>
                            </ul>
                        </div>

                        {/* Product Categories */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Our Specializations</h4>
                            <ul className="footer-links">
                                <li>Surgical Scissors & Forceps</li>
                                <li>Scalpels & Blades</li>
                                <li>Retractors & Spreaders</li>
                                <li>Needle Holders & Sutures</li>
                                <li>Clamps & Hemostats</li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Contact Information</h4>
                            <ul className="footer-contact">
                                <li>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{contact?.address || 'India'}</span>
                                </li>
                                <li>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    <span>{contact?.phone || '+91-XXXXXXXXXX'}</span>
                                </li>
                                <li>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span>{contact?.email || 'info@srpharmagicalexporter.com'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p className="footer-copyright">
                            © {currentYear} {settings?.copyright_text || 'SR Pharmagical Exporter. All Rights Reserved.'}
                        </p>
                        <div className="footer-links-inline">
                            <Link to="/about">About</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/developer">Developer</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
