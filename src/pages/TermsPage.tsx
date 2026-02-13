import './LegalPages.css';

const TermsPage = () => {
    return (
        <div className="legal-page">
            <section className="page-hero">
                <div className="container">
                    <h1 className="page-title">Terms & Conditions</h1>
                    <p className="page-subtitle">Please read these terms carefully before using our services</p>
                </div>
            </section>

            <section className="legal-content">
                <div className="container">
                    <div className="legal-card">
                        <p className="effective-date">Effective Date: February 12, 2026</p>

                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using the Shahraj Exporter website and services, you agree to be bound
                            by these Terms & Conditions. If you do not agree with any part of these terms, please do not
                            use our website or services.
                        </p>

                        <h2>2. Products & Services</h2>
                        <p>
                            Shahraj Exporter manufactures, supplies, and exports premium surgical instruments.
                            All products listed on our website are subject to availability. We reserve the right to
                            discontinue any product at any time without prior notice.
                        </p>
                        <ul>
                            <li>Product images are for illustrative purposes and may slightly differ from actual products</li>
                            <li>Specifications are subject to change without prior notice due to continuous improvements</li>
                            <li>All surgical instruments are intended for use by trained medical professionals only</li>
                        </ul>

                        <h2>3. Ordering & Pricing</h2>
                        <ul>
                            <li>All prices are quoted in the currency specified at the time of inquiry and are subject to change</li>
                            <li>Orders are confirmed only upon written acceptance from Shahraj Exporter</li>
                            <li>Minimum order quantities may apply for certain product categories</li>
                            <li>Custom orders may require additional lead time and are non-cancellable once production begins</li>
                        </ul>

                        <h2>4. Quality Assurance</h2>
                        <p>
                            All our surgical instruments undergo rigorous quality control processes and comply with
                            applicable international standards, including:
                        </p>
                        <ul>
                            <li>ISO 9001:2015 Quality Management System certification</li>
                            <li>CE marking compliance for European markets</li>
                            <li>FDA registration for products exported to the United States</li>
                            <li>WHO GMP (Good Manufacturing Practices) compliance</li>
                        </ul>

                        <h2>5. Shipping & Delivery</h2>
                        <ul>
                            <li>Delivery timelines are estimates and not guaranteed</li>
                            <li>Shipping terms (FOB, CIF, etc.) will be specified in the commercial invoice</li>
                            <li>Risk of loss passes to the buyer as per agreed Incoterms</li>
                            <li>Import duties, customs fees, and local taxes are the responsibility of the buyer</li>
                        </ul>

                        <h2>6. Returns & Warranty</h2>
                        <p>
                            Shahraj Exporter stands behind the quality of its products. Our return and warranty
                            policy includes:
                        </p>
                        <ul>
                            <li>Manufacturing defects are covered under warranty for 12 months from date of delivery</li>
                            <li>Returns must be initiated within 30 days of delivery for non-defective items</li>
                            <li>Products must be unused, in original packaging, and in resalable condition for returns</li>
                            <li>Custom or made-to-order products are non-returnable</li>
                        </ul>

                        <h2>7. Intellectual Property</h2>
                        <p>
                            All content on this website — including text, graphics, logos, product images, and software —
                            is the property of Shahraj Exporter and is protected by applicable intellectual property laws.
                            Unauthorized use, reproduction, or distribution is prohibited.
                        </p>

                        <h2>8. Limitation of Liability</h2>
                        <p>
                            Shahraj Exporter shall not be liable for any indirect, incidental, special, or
                            consequential damages arising from the use of our products or services. Our total liability
                            shall not exceed the value of the specific order in question.
                        </p>

                        <h2>9. Medical Disclaimer</h2>
                        <p>
                            Our surgical instruments are designed for use by qualified and trained medical professionals.
                            Shahraj Exporter is not responsible for any misuse, improper handling, or use of instruments
                            by unqualified individuals. Users must follow all applicable medical regulations and protocols.
                        </p>

                        <h2>10. Force Majeure</h2>
                        <p>
                            Shahraj Exporter shall not be held liable for delays or failure to perform due to
                            circumstances beyond our control, including but not limited to natural disasters, pandemics,
                            government actions, supply chain disruptions, or transportation failures.
                        </p>

                        <h2>11. Governing Law</h2>
                        <p>
                            These Terms & Conditions are governed by and construed in accordance with the laws of India.
                            Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the
                            courts in India.
                        </p>

                        <h2>12. Changes to Terms</h2>
                        <p>
                            Shahraj Exporter reserves the right to modify these Terms & Conditions at any time.
                            Changes will be posted on this page with an updated effective date. Continued use of our
                            website after changes constitutes acceptance of the modified terms.
                        </p>

                        <h2>13. Contact Information</h2>
                        <p>For questions regarding these Terms & Conditions, please contact us:</p>
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

export default TermsPage;
