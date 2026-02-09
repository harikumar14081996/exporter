import { Link } from 'react-router-dom';
import './ProductCard.css';

interface Product {
    id: number | string;
    title: string;
    description: string;
    icon: string;
    image_url?: string;
    category: string;
}

interface ProductCardProps {
    product: Product;
}

const getProductSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/&/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
};

const ProductCard = ({ product }: ProductCardProps) => {
    const slug = getProductSlug(product.title);

    return (
        <div className="product-card">
            <div className="product-card-icon">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.title}
                        className="product-image"
                    />
                ) : (
                    <div className="icon-wrapper">
                        {product.icon}
                    </div>
                )}
            </div>
            <div className="product-card-content">
                <h3 className="product-card-title">{product.title}</h3>
                <p className="product-card-description">{product.description}</p>
                <span className="product-card-category">{product.category}</span>
            </div>
            <div className="product-card-footer">
                <Link to={`/product/${slug}`} className="product-card-link">
                    View Details
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8.293 2.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 9H2a1 1 0 110-2h9.586L8.293 3.707a1 1 0 010-1.414z" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
