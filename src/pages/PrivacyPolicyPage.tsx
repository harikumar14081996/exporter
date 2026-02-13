import './LegalPages.css';

const PrivacyPolicyPage = () => {
    return (
        <div className="legal-page">
            <section className="page-hero">
                <div className="container">
                    <h1 className="page-title">Privacy Policy</h1>
                    <p className="page-subtitle">Your privacy is important to us</p>
                </div>
            </section>

            <section className="legal-content">
                <div className="container">
                    <div className="legal-card">
                        <p className="effective-date">Effective Date: February 12, 2026</p>

                        <h2>1. Introduction</h2>
                        <p>
                            Shahraj Exporter ("we," "our," or "us") is committed to protecting the privacy of our customers,
                            business partners, and website visitors. This Privacy Policy explains how we collect, use, disclose,
                            and safeguard your information when you visit our website or interact with our services.
                        </p>

                        <h2>2. Information We Collect</h2>
                        <h3>2.1 Personal Information</h3>
                        <p>We may collect the following personal information when you interact with us:</p>
                        <ul>
                            <li>Full name and contact details (email, phone number, address)</li>
                            <li>Company/organization name and job title</li>
                            <li>Shipping and billing addresses</li>
                            <li>Product inquiries and quote requests</li>
                            <li>Communication preferences</li>
                        </ul>

                        <h3>2.2 Automatically Collected Information</h3>
                        <p>When you visit our website, we may automatically collect:</p>
                        <ul>
                            <li>IP address and browser type</li>
                            <li>Device information and operating system</li>
                            <li>Pages visited and time spent on each page</li>
                            <li>Referring website or search engine</li>
                        </ul>

                        <h2>3. How We Use Your Information</h2>
                        <p>We use the information collected for the following purposes:</p>
                        <ul>
                            <li>Processing and fulfilling product orders and quote requests</li>
                            <li>Communicating about products, services, and promotions</li>
                            <li>Providing customer support and responding to inquiries</li>
                            <li>Improving our website, products, and services</li>
                            <li>Complying with legal obligations and regulatory requirements</li>
                            <li>Maintaining records for quality assurance and certification compliance</li>
                        </ul>

                        <h2>4. Information Sharing</h2>
                        <p>
                            We do not sell, trade, or rent your personal information to third parties. We may share
                            your information only in the following circumstances:
                        </p>
                        <ul>
                            <li><strong>Shipping Partners:</strong> To facilitate delivery of surgical instruments to your location</li>
                            <li><strong>Regulatory Bodies:</strong> When required by law or to comply with medical device regulations</li>
                            <li><strong>Service Providers:</strong> Trusted third-party vendors who assist in operating our website and business</li>
                            <li><strong>Legal Requirements:</strong> When disclosure is required by law, court order, or government regulation</li>
                        </ul>

                        <h2>5. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal information, including:
                        </p>
                        <ul>
                            <li>SSL/TLS encryption for data transmission</li>
                            <li>Secure server infrastructure with regular security updates</li>
                            <li>Access controls and authentication mechanisms</li>
                            <li>Regular security audits and vulnerability assessments</li>
                        </ul>

                        <h2>6. Cookies</h2>
                        <p>
                            Our website uses cookies to enhance your browsing experience. Cookies are small text files
                            stored on your device that help us understand how you use our site. You can manage cookie
                            preferences through your browser settings.
                        </p>

                        <h2>7. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access, correct, or delete your personal information</li>
                            <li>Opt out of marketing communications at any time</li>
                            <li>Request a copy of the data we hold about you</li>
                            <li>Lodge a complaint with a supervisory authority</li>
                        </ul>

                        <h2>8. Data Retention</h2>
                        <p>
                            We retain your personal information only for as long as necessary to fulfill the purposes
                            for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements.
                            Order-related data may be retained for a minimum of 7 years as required by regulatory standards.
                        </p>

                        <h2>9. International Transfers</h2>
                        <p>
                            As an international exporter of surgical instruments, your information may be transferred
                            to and processed in countries outside your country of residence. We ensure that appropriate
                            safeguards are in place to protect your data during such transfers.
                        </p>

                        <h2>10. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes will be posted on this page
                            with an updated effective date. We encourage you to review this policy periodically.
                        </p>

                        <h2>11. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy or our data practices, please contact us at:
                        </p>
                        <ul>
                            <li><strong>Email:</strong> info@shahrajexporter.com</li>
                            <li><strong>Website:</strong> www.shahrajexporter.com</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicyPage;
