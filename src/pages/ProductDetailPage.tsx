import { useParams, Link } from 'react-router-dom';
import './ProductDetailPage.css';

interface ProductData {
    id: string;
    title: string;
    category: string;
    description: string;
    fullDescription: string;
    features: string[];
    specifications: { label: string; value: string }[];
    icon: string;
}

const productsData: Record<string, ProductData> = {
    'scissors-forceps': {
        id: 'scissors-forceps',
        title: 'Surgical Scissors & Forceps',
        category: 'Cutting Instruments',
        description: 'Precision surgical scissors and forceps for delicate surgical procedures.',
        fullDescription: 'Our surgical scissors and forceps are manufactured using premium grade stainless steel, ensuring superior cutting precision and durability. Designed for various surgical specialties including general surgery, cardiovascular, and microsurgery.',
        features: [
            'Premium stainless steel construction',
            'Ergonomic design for reduced hand fatigue',
            'Available in various sizes (4" to 12")',
            'Autoclavable and corrosion resistant',
            'Sharp, precise cutting edges',
            'Smooth jaw action',
        ],
        specifications: [
            { label: 'Material', value: 'German Stainless Steel' },
            { label: 'Finish', value: 'Satin/Mirror Polish' },
            { label: 'Sterilization', value: 'Autoclavable up to 134°C' },
            { label: 'Sizes Available', value: '4", 5", 6", 7", 9", 12"' },
        ],
        icon: '✂️',
    },
    'scalpels': {
        id: 'scalpels',
        title: 'Scalpels & Blades',
        category: 'Surgical Blades',
        description: 'High-grade surgical scalpels and replacement blades.',
        fullDescription: 'Premium surgical scalpels with superior sharpness and control. Our scalpel handles and disposable blades meet international quality standards, offering exceptional precision for various surgical procedures.',
        features: [
            'Handles in sizes #3, #4, #7, and #9',
            'Compatible with standard blades',
            'Carbon steel and stainless steel blades',
            'Individual sterile packaging',
            'Ultra-sharp cutting edge',
            'Consistent blade thickness',
        ],
        specifications: [
            { label: 'Handle Material', value: 'Stainless Steel' },
            { label: 'Blade Material', value: 'Carbon Steel/Stainless Steel' },
            { label: 'Blade Sizes', value: '#10 to #25' },
            { label: 'Packaging', value: 'Individually Wrapped, Sterile' },
        ],
        icon: '🔪',
    },
    'retractors': {
        id: 'retractors',
        title: 'Retractors & Spreaders',
        category: 'Retraction Tools',
        description: 'Self-retaining and handheld retractors for optimal surgical exposure.',
        fullDescription: 'Professional-grade retractors designed to provide optimal surgical field exposure. Available in various types including Weitlaner, Gelpi, Balfour, and Army-Navy retractors.',
        features: [
            'Self-retaining and handheld options',
            'Various blade widths and depths',
            'Smooth ratchet mechanism',
            'Atraumatic blade design',
            'Easy to clean and sterilize',
            'Long-lasting durability',
        ],
        specifications: [
            { label: 'Types', value: 'Weitlaner, Gelpi, Balfour, Army-Navy' },
            { label: 'Material', value: 'Surgical Grade Stainless Steel' },
            { label: 'Blade Options', value: 'Sharp/Blunt, 2-4 Prongs' },
            { label: 'Sizes', value: 'Various (4" to 12")' },
        ],
        icon: '🔧',
    },
};

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const product = id ? productsData[id] : null;

    if (!product) {
        return (
            <div className="product-not-found">
                <div className="container">
                    <h1>Product Not Found</h1>
                    <p>The product you're looking for doesn't exist.</p>
                    <Link to="/" className="btn btn-primary">Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            {/* Breadcrumb */}
            <section className="breadcrumb-section">
                <div className="container">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>Products</span>
                        <span>/</span>
                        <span>{product.title}</span>
                    </nav>
                </div>
            </section>

            {/* Product Header */}
            <section className="product-header">
                <div className="container">
                    <div className="product-header-grid">
                        <div className="product-icon-large">
                            <div className="icon-circle">
                                {product.icon}
                            </div>
                        </div>
                        <div className="product-header-info">
                            <span className="product-category-badge">{product.category}</span>
                            <h1 className="product-title">{product.title}</h1>
                            <p className="product-description">{product.description}</p>
                            <div className="product-actions">
                                <Link to="/get-quote" className="btn btn-primary">
                                    Request Quote
                                </Link>
                                <Link to="/contact" className="btn btn-outline">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Details */}
            <section className="product-details-section">
                <div className="container">
                    <div className="details-grid">
                        {/* Main Content */}
                        <div className="details-main">
                            <div className="detail-block">
                                <h2>Product Overview</h2>
                                <p>{product.fullDescription}</p>
                            </div>

                            <div className="detail-block">
                                <h2>Key Features</h2>
                                <ul className="features-list">
                                    {product.features.map((feature, index) => (
                                        <li key={index}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="details-sidebar">
                            <div className="specs-card">
                                <h3>Specifications</h3>
                                <dl className="specs-list">
                                    {product.specifications.map((spec, index) => (
                                        <div key={index} className="spec-item">
                                            <dt>{spec.label}</dt>
                                            <dd>{spec.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="cta-card">
                                <h3>Interested in this product?</h3>
                                <p>Get a customized quote tailored to your requirements</p>
                                <Link to="/get-quote" className="btn btn-primary btn-block">
                                    Get Quote Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetailPage;
