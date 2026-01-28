import { useState } from 'react';
import { apiService } from '../services/api';
import './GetQuotePage.css';

const GetQuotePage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        product: '',
        quantity: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitSuccess(false);

        try {
            await apiService.submitQuote({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                product_interest: formData.product,
                quantity: formData.quantity,
                message: formData.message,
            });

            setSubmitSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                product: '',
                quantity: '',
                message: '',
            });

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            console.error('Error submitting quote:', error);
            alert('Failed to submit quote. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="quote-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="container">
                    <h1 className="page-title">Get a Quote</h1>
                    <p className="page-subtitle">Request pricing for premium surgical instruments</p>
                </div>
            </section>

            {/* Quote Form Section */}
            <section className="quote-content-section">
                <div className="container">
                    <div className="quote-grid">
                        {/* Left Column - Info */}
                        <div className="quote-info-column">
                            <h2>Why Request a Quote?</h2>
                            <div className="quote-benefits">
                                <div className="benefit-item">
                                    <div className="benefit-icon">💰</div>
                                    <div>
                                        <h4>Competitive Pricing</h4>
                                        <p>Get the best rates for bulk orders and long-term partnerships</p>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <div className="benefit-icon">⚡</div>
                                    <div>
                                        <h4>Quick Response</h4>
                                        <p>Receive detailed quotations within 24 hours</p>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <div className="benefit-icon">✅</div>
                                    <div>
                                        <h4>Customization Available</h4>
                                        <p>Tailored solutions to meet your specific requirements</p>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <div className="benefit-icon">🌍</div>
                                    <div>
                                        <h4>Global Shipping</h4>
                                        <p>We ship to 70+ countries with reliable logistics</p>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-box">
                                <h3>Need Immediate Assistance?</h3>
                                <p>Our team is ready to help you with your inquiries</p>
                                <div className="contact-details">
                                    <p className="contact-item">
                                        📞 <strong>Phone:</strong> +91-XXXXXXXXXX
                                    </p>
                                    <p className="contact-item">
                                        ✉️ <strong>Email:</strong> info@srpharmagicalexporter.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Form */}
                        <div className="quote-form-column">
                            <div className="quote-form-wrapper">
                                <h2>Request Your Quote</h2>
                                <form onSubmit={handleSubmit} className="quote-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="name">Full Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone Number *</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="company">Company Name</label>
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="product">Product Category *</label>
                                        <select
                                            id="product"
                                            name="product"
                                            value={formData.product}
                                            onChange={handleChange}
                                            className="form-input"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            <option value="scissors-forceps">Surgical Scissors & Forceps</option>
                                            <option value="scalpels">Scalpels & Blades</option>
                                            <option value="retractors">Retractors & Spreaders</option>
                                            <option value="needle-holders">Needle Holders & Sutures</option>
                                            <option value="clamps">Clamps & Hemostats</option>
                                            <option value="orthopedic">Orthopedic Instruments</option>
                                            <option value="diagnostic">Diagnostic Instruments</option>
                                            <option value="dental">Dental Surgery Instruments</option>
                                            <option value="ophthalmic">Ophthalmic Instruments</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="quantity">Estimated Quantity *</label>
                                        <input
                                            type="text"
                                            id="quantity"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="e.g., 100 units"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">Additional Requirements</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="form-textarea"
                                            rows={5}
                                            placeholder="Tell us about your specific needs, delivery timeline, etc."
                                        ></textarea>
                                    </div>

                                    {submitSuccess && (
                                        <div style={{
                                            padding: '1rem',
                                            backgroundColor: '#d4edda',
                                            color: '#155724',
                                            borderRadius: '8px',
                                            marginBottom: '1rem',
                                            border: '1px solid #c3e6cb'
                                        }}>
                                            ✓ Thank you for your quote request! We will contact you shortly with pricing details.
                                        </div>
                                    )}

                                    <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                                        {submitting ? 'Submitting...' : 'Submit Quote Request'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GetQuotePage;
