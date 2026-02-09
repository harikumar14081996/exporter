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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Validate name
        if (!formData.name.trim() || formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Validate phone - international format or local format
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number (digits, spaces, +, -, (, ) only)';
        }

        // Validate product category
        if (!formData.product) {
            newErrors.product = 'Please select a product category';
        }

        // Validate quantity - must be numeric
        const quantityNum = parseInt(formData.quantity);
        if (!formData.quantity || isNaN(quantityNum) || quantityNum <= 0) {
            newErrors.quantity = 'Please enter a valid quantity (numbers only, greater than 0)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) {
            return;
        }

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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
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
                                                className={`form-input ${errors.name ? 'error' : ''}`}
                                                required
                                                minLength={2}
                                            />
                                            {errors.name && <span className="error-message">{errors.name}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`form-input ${errors.email ? 'error' : ''}`}
                                                required
                                            />
                                            {errors.email && <span className="error-message">{errors.email}</span>}
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
                                                className={`form-input ${errors.phone ? 'error' : ''}`}
                                                placeholder="+1-234-567-8900"
                                                required
                                            />
                                            {errors.phone && <span className="error-message">{errors.phone}</span>}
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
                                            className={`form-input ${errors.product ? 'error' : ''}`}
                                            required
                                        >
                                            {errors.product && <span className="error-message">{errors.product}</span>}
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
                                            className={`form-input ${errors.quantity ? 'error' : ''}`}
                                            placeholder="e.g., 100"
                                            required
                                        />
                                        {errors.quantity && <span className="error-message">{errors.quantity}</span>}
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
