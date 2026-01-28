import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { config } from '../../config/api';
import './CategoryManagementPage.css';

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await apiService.getCategories();
            // Get product count for each category via admin endpoint if available, 
            // but for now we just get the public categories list which is fine.
            // If we needed extra admin data, we'd use a specific admin endpoint.
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category: any = null) => {
        setEditingCategory(category);
        setFormData({ name: category ? category.name : '' });
        setError('');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('Not authenticated');

            const url = editingCategory
                ? `${config.endpoints.adminCategories}/${editingCategory.id}`
                : config.endpoints.adminCategories;

            const method = editingCategory ? 'PUT' : 'POST';

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

            fetchCategories();
            handleCloseModal();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this category? Products in this category must be deleted first.')) return;

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('Not authenticated');

            const response = await fetch(`${config.endpoints.adminCategories}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Delete failed');
            }

            fetchCategories();
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Category Management</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    + Add Category
                </button>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Products</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.product_count || 0}</td>
                                <td className="actions-cell">
                                    <button
                                        className="btn-icon edit"
                                        onClick={() => handleOpenModal(category)}
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-icon delete"
                                        onClick={() => handleDelete(category.id)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingCategory ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagementPage;
