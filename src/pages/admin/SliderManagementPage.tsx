import { useState, useEffect } from 'react';
import { config } from '../../config/api';
import './SliderManagementPage.css';

const SliderManagementPage = () => {
    const [sliders, setSliders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSlider, setEditingSlider] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        cta_text: 'Learn More',
        cta_link: '#products',
        image_url: '',
        is_active: true
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSliders();
    }, []);

    const fetchSliders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(config.endpoints.adminSliders, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch sliders');
            const data = await response.json();
            // Sort by position
            setSliders(data.sort((a: any, b: any) => a.position - b.position));
        } catch (error) {
            console.error('Error fetching sliders:', error);
            setError('Failed to load sliders');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (slider: any = null) => {
        setEditingSlider(slider);
        if (slider) {
            setFormData({
                title: slider.title,
                subtitle: slider.subtitle || '',
                description: slider.description || '',
                cta_text: slider.cta_text || 'Learn More',
                cta_link: slider.cta_link || '#products',
                image_url: slider.image_url || '',
                is_active: slider.is_active
            });
        } else {
            setFormData({
                title: '',
                subtitle: '',
                description: '',
                cta_text: 'Learn More',
                cta_link: '#products', // Default to products section
                image_url: '',
                is_active: true
            });
        }
        setError('');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingSlider(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('Not authenticated');

            const url = editingSlider
                ? `${config.endpoints.adminSliders}/${editingSlider.id}`
                : config.endpoints.adminSliders;

            const method = editingSlider ? 'PUT' : 'POST';

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

            fetchSliders();
            handleCloseModal();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this slider?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${config.endpoints.adminSliders}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Delete failed');
            }

            fetchSliders();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleMove = async (id: number, direction: 'up' | 'down') => {
        // Find current slider index
        const index = sliders.findIndex(s => s.id === id);
        if (index === -1) return;

        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sliders.length - 1) return;

        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        const currentSlider = sliders[index];
        const swapSlider = sliders[swapIndex];

        // Optimistically update UI
        const newSliders = [...sliders];
        newSliders[index] = swapSlider;
        newSliders[swapIndex] = currentSlider;
        setSliders(newSliders);

        // Call backend to update positions logic if needed, 
        // OR simply swap positions via API calls if the API supports explicit position update.
        // Assuming the backend has a specific reorder endpoint or we update each one.
        // For simplicity, let's try to update both sliders with new positions.

        try {
            const token = localStorage.getItem('adminToken');

            // Update current slider
            await fetch(`${config.endpoints.adminSliders}/${currentSlider.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ position: swapSlider.position }) // Swap position
            });

            // Update swapped slider
            await fetch(`${config.endpoints.adminSliders}/${swapSlider.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ position: currentSlider.position }) // Swap position
            });

            // Refresh to ensure server consistency
            fetchSliders();

        } catch (error) {
            console.error('Error reordering:', error);
            fetchSliders(); // Revert on error
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Slider Management</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    + Add Slide
                </button>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Review</th>
                            <th>Title & Subtitle</th>
                            <th>Status And Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sliders.map((slider, index) => (
                            <tr key={slider.id}>
                                <td>
                                    {slider.image_url ? (
                                        <img src={slider.image_url} alt="slide" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                                    ) : (
                                        <div style={{ width: '80px', height: '45px', background: '#e5e7eb', borderRadius: '4px' }}></div>
                                    )}
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280', maxWidth: '200px' }}>
                                        {slider.description?.substring(0, 60)}...
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: '500' }}>{slider.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{slider.subtitle}</div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <span className={`status-badge ${slider.is_active ? 'active' : 'inactive'}`}
                                            style={{
                                                width: 'fit-content',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                backgroundColor: slider.is_active ? '#dcfce7' : '#fee2e2',
                                                color: slider.is_active ? '#16a34a' : '#dc2626'
                                            }}
                                        >
                                            {slider.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Order: {slider.position}</span>
                                    </div>
                                </td>
                                <td className="actions-cell">
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleMove(slider.id, 'up')}
                                        disabled={index === 0}
                                        style={{ opacity: index === 0 ? 0.3 : 1 }}
                                        title="Move Up"
                                    >
                                        ⬆️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleMove(slider.id, 'down')}
                                        disabled={index === sliders.length - 1}
                                        style={{ opacity: index === sliders.length - 1 ? 0.3 : 1 }}
                                        title="Move Down"
                                    >
                                        ⬇️
                                    </button>
                                    <button className="btn-icon edit" onClick={() => handleOpenModal(slider)} title="Edit">✏️</button>
                                    <button className="btn-icon delete" onClick={() => handleDelete(slider.id)} title="Delete">🗑️</button>
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
                        <h2>{editingSlider ? 'Edit Slide' : 'Add New Slide'}</h2>
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                />
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
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>CTA Text</label>
                                    <input
                                        type="text"
                                        value={formData.cta_text}
                                        onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>CTA Link</label>
                                    <input
                                        type="text"
                                        value={formData.cta_link}
                                        onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                                    />
                                </div>
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
                                    {editingSlider ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SliderManagementPage;
