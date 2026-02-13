import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './AboutPage.css';
import './LegalPages.css';

interface ValueItem {
    icon: string;
    title: string;
    description: string;
}

interface WhyChooseItem {
    title: string;
    description: string;
}

interface AboutContent {
    story: string;
    values: ValueItem[];
    whyChoose: WhyChooseItem[];
}

const AboutPage = () => {
    const [content, setContent] = useState<AboutContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const data = await apiService.getAbout();
                // Parse the content string if it comes as a JSON string
                let parsedContent = data.content;
                if (typeof data.content === 'string') {
                    try {
                        parsedContent = JSON.parse(data.content);
                    } catch (e) {
                        console.error('Error parsing about content:', e);
                    }
                }
                setContent(parsedContent);
            } catch (error) {
                console.error('Error fetching about content:', error);
                // Fallback content
                setContent({
                    story: "Shahraj Exporter has been a trusted name in surgical instruments manufacturing and export for years. We combine precision engineering with medical-grade quality standards to deliver instruments that medical professionals worldwide depend on.\n\nOur journey began with a vision to provide healthcare professionals with surgical instruments that meet the highest international standards. Today, we export to over 70 countries and serve thousands of hospitals, clinics, and medical institutions globally.",
                    values: [
                        { icon: "⚙️", title: "Precision Engineering", description: "Advanced manufacturing techniques ensure every instrument meets exact specifications with superior quality." },
                        { icon: "✅", title: "Quality Certified", description: "ISO 9001, CE marked, and FDA approved products that comply with international medical standards." },
                        { icon: "🌍", title: "Global Presence", description: "Exporting to 70+ countries with a strong distribution network and satisfied customers worldwide." },
                        { icon: "🔬", title: "Medical Grade Materials", description: "Premium stainless steel and titanium instruments that ensure durability and sterility." },
                        { icon: "🎯", title: "Customer Focus", description: "Dedicated to understanding and meeting the unique needs of healthcare professionals." },
                        { icon: "🚀", title: "Continuous Innovation", description: "Investing in research and development to create next-generation surgical instruments." }
                    ],
                    whyChoose: [
                        { title: "25+ Years of Experience", description: "Decades of expertise in surgical instrument manufacturing and global distribution." },
                        { title: "5000+ Product Range", description: "Comprehensive catalog covering all surgical specialties and medical disciplines." },
                        { title: "100% Quality Assurance", description: "Every instrument undergoes multiple quality checks before delivery." },
                        { title: "Competitive Pricing", description: "Best value for premium quality instruments without compromising standards." },
                        { title: "Timely Delivery", description: "Efficient logistics and shipping to ensure your orders arrive on schedule." },
                        { title: "Expert Support", description: "Technical assistance and customer service from knowledgeable professionals." }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAbout();
    }, []);

    if (loading) {
        return (
            <div className="about-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--primary)', fontSize: '18px' }}>Loading...</div>
            </div>
        );
    }

    if (!content) return null;

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="container">
                    <h1 className="page-title">About Shahraj Exporter</h1>
                    <p className="page-subtitle">Leading Manufacturer & Exporter of Premium Surgical Instruments</p>
                </div>
            </section>

            {/* Company Overview */}
            <section className="about-content-section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text-content">
                            <h2>Our Story</h2>
                            {content.story.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                        <div className="about-image-content">
                            <div className="image-placeholder-about">
                                <svg viewBox="0 0 400 500" fill="none">
                                    <rect width="400" height="500" fill="url(#about-gradient-2)" rx="20" />
                                    <circle cx="200" cy="200" r="80" fill="rgba(255,255,255,0.2)" />
                                    <path d="M200 150 L200 250 M150 200 L250 200" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="about-gradient-2" x1="0" y1="0" x2="400" y2="500">
                                            <stop offset="0%" stopColor="#0066cc" />
                                            <stop offset="100%" stopColor="#00a86b" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="values-section bg-gray-50">
                <div className="container">
                    <h2 className="section-title">Our Core Values</h2>
                    <div className="values-grid">
                        {content.values.map((value, index) => (
                            <div key={index} className="value-card">
                                <div className="value-icon">{value.icon}</div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certificates & Accreditations */}
            <section className="certificates-section">
                <div className="container">
                    <h2 className="section-title">Certificates & Accreditations</h2>
                    <div className="certificates-grid">
                        <div className="certificate-card">
                            <div className="cert-upload-placeholder">
                                <span className="cert-icon">📜</span>
                            </div>
                            <h4>ISO 9001:2015</h4>
                            <p>Quality Management System certified for surgical instrument manufacturing</p>
                        </div>
                        <div className="certificate-card">
                            <div className="cert-upload-placeholder">
                                <span className="cert-icon">🇪🇺</span>
                            </div>
                            <h4>CE Marking</h4>
                            <p>European Conformity marking for medical devices and surgical instruments</p>
                        </div>
                        <div className="certificate-card">
                            <div className="cert-upload-placeholder">
                                <span className="cert-icon">🇺🇸</span>
                            </div>
                            <h4>FDA Registered</h4>
                            <p>Registered with the U.S. Food and Drug Administration for medical device exports</p>
                        </div>
                        <div className="certificate-card">
                            <div className="cert-upload-placeholder">
                                <span className="cert-icon">🏥</span>
                            </div>
                            <h4>WHO GMP</h4>
                            <p>World Health Organization Good Manufacturing Practices compliance</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-choose-section">
                <div className="container">
                    <h2 className="section-title">Why Choose Shahraj?</h2>
                    <div className="why-choose-grid">
                        {content.whyChoose.map((item, index) => (
                            <div key={index} className="why-item">
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
