import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import ProductCard from '../components/ProductCard';
import './CategoryProductsPage.css';

const CategoryProductsPage = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [products, setProducts] = useState<any[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!categoryId) return;

            setLoading(true);
            try {
                // Fetch products for category
                const productsData = await apiService.getCategoryProducts(parseInt(categoryId));
                setProducts(productsData);

                // Fetch category name (optimization: could be passed via state or cached)
                const categories = await apiService.getCategories();
                const category = categories.find((c: any) => c.id === parseInt(categoryId));
                if (category) {
                    setCategoryName(category.name);
                }
            } catch (error) {
                console.error('Error fetching category products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId]);

    if (loading) {
        return (
            <div className="category-page-loading">
                <div className="spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="category-products-page">
            <div className="category-hero">
                <div className="container">
                    <h1 className="category-title">{categoryName || 'Products'}</h1>
                    <div className="breadcrumbs">
                        <Link to="/">Home</Link>
                        <span className="separator">/</span>
                        <span className="current">{categoryName || 'Products'}</span>
                    </div>
                </div>
            </div>

            <div className="container category-content">
                {products.length === 0 ? (
                    <div className="no-products">
                        <p>No products found in this category.</p>
                        <Link to="/" className="btn btn-primary">Back to Home</Link>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={{
                                    ...product,
                                    title: product.name,
                                    category: categoryName
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryProductsPage;
