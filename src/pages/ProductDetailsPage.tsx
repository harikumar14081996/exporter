import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Helper to match slug to product
    const getProductSlug = (title: string): string => {
        return title
            .toLowerCase()
            .replace(/&/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    };

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                // Since we don't have a direct slug API, we fetch all categories and find the product
                // This is a client-side workaround to avoid backend schema changes for now
                const categories = await apiService.getCategories();
                let foundProduct = null;
                let foundCategoryName = '';

                // Iterate categories to find product
                for (const cat of categories) {
                    const products = await apiService.getCategoryProducts(cat.id);
                    const match = products.find((p: any) => getProductSlug(p.name) === slug);
                    if (match) {
                        foundProduct = match;
                        foundCategoryName = cat.name;
                        break;
                    }
                }

                if (foundProduct) {
                    setProduct({ ...foundProduct, categoryName: foundCategoryName });
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    if (error || !product) {
        return (
            <div className="error-container">
                <h2>Product Not Found</h2>
                <Link to="/" className="btn btn-primary">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="product-details-page">
            <div className="container">
                <div className="breadcrumbs">
                    <Link to="/">Home</Link>
                    <span className="separator">/</span>
                    <Link to={`/category/${product.category_id}`}>{product.categoryName}</Link>
                    <span className="separator">/</span>
                    <span className="current">{product.name}</span>
                </div>

                <div className="product-details-grid">
                    <div className="product-image-section">
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="product-main-image" />
                        ) : (
                            <div className="product-placeholder-icon">{product.icon || '📦'}</div>
                        )}
                    </div>

                    <div className="product-info-section">
                        <h1 className="product-title">{product.name}</h1>
                        <div className="product-category-badge">{product.categoryName}</div>

                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className="product-actions">
                            <Link
                                to={`/get-quote?product=${encodeURIComponent(product.name)}`}
                                className="btn btn-primary btn-large"
                            >
                                Request Quote
                            </Link>
                            <a href="tel:+919876543210" className="btn btn-secondary btn-large">
                                Call Now
                            </a>
                        </div>

                        <div className="product-features">
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <div>
                                    <strong>Premium Quality</strong>
                                    <p>Medical grade stainless steel</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <div>
                                    <strong>Certified</strong>
                                    <p>ISO & CE Approved</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <div>
                                    <strong>Global Shipping</strong>
                                    <p>Available worldwide</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
