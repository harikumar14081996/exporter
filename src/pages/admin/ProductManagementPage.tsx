import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { config } from '../../config/api';
import './ProductManagementPage.css';

const ProductManagementPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        image_url: '',
        icon: '',
        is_active: true
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsData] = await Promise.all([
                    apiService.getCategories(),
                    fetchProducts() // Initial fetch
                ]);
                setCategories(catsData);
            } catch (error) {
                console.error('Error initializing:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchProducts = async () => {
        try {
            // If we had a getAllProducts admin endpoint it would be better,
            // but for now we can iterate categories or just assume we have an endpoint.
            // The task list said "/api/admin/products - CRUD operations", so it should exist.
            const token = localStorage.getItem('adminToken');
            const response = await fetch(config.endpoints.adminProducts, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    };

    const handleOpenModal = (product: any = null) => {
        setEditingProduct(product);
        if (product) {
            setFormData({
                name: product.name,
                description: product.description || '',
                category_id: product.category_id,
                image_url: product.image_url || '',
                icon: product.icon || '',
                is_active: product.is_active
            });
        } else {
            setFormData({
                name: '',
                description: '',
                category_id: categories.length > 0 ? categories[0].id : '',
                image_url: '',
                icon: '',
                is_active: true
            });
        }
        setError('');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('Not authenticated');

            const url = editingProduct
                ? `${config.endpoints.adminProducts}/${editingProduct.id}`
                : config.endpoints.adminProducts;

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Operation failed');
            }

            fetchProducts();
            handleCloseModal();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${config.endpoints.adminProducts}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Delete failed');
            }

            fetchProducts();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category_id === parseInt(selectedCategory));

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Product Management</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    + Add Product
                </button>
            </div>

            <div className="filters-bar" style={{ marginBottom: '1rem' }}>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-filter"
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => {
                            const category = categories.find(c => c.id === product.category_id);
                            return (
                                <tr key={product.id}>
                                    <td>
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', background: '#e5e7eb', borderRadius: '4px' }}></div>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '500' }}>{product.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                            {product.description?.substring(0, 50)}...
                                        </div>
                                    </td>
                                    <td>{category?.name || 'Unknown'}</td>
                                    <td>
                                        <span className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}
                                            style={{
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                backgroundColor: product.is_active ? '#dcfce7' : '#fee2e2',
                                                color: product.is_active ? '#16a34a' : '#dc2626'
                                            }}
                                        >
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="btn-icon edit" onClick={() => handleOpenModal(product)}>✏️</button>
                                        <button className="btn-icon delete" onClick={() => handleDelete(product.id)}>🗑️</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Icon (Optional emoji or class)</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="e.g. ✂️"
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        style={{ width: 'auto' }}
                                    />
                                    Active
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingProduct ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagementPage;
