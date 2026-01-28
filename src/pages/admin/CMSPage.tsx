import { useState, useEffect } from 'react';
import { config } from '../../config/api';
import './CMSPage.css';

const CMSPage = () => {
    const [activeTab, setActiveTab] = useState('about');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState('');

    // About Data
    const [aboutData, setAboutData] = useState({
        story: '',
        values: [],
        whyChoose: []
    });

    // Contact Data
    const [contactData, setContactData] = useState({
        address: '',
        phone: '',
        email: '',
        map_url: ''
    });

    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab]);

    const fetchData = async (tab: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const headers = { 'Authorization': `Bearer ${token}` };

            if (tab === 'about') {
                const res = await fetch(config.endpoints.adminAbout, { headers });
                if (res.ok) {
                    const data = await res.json();
                    let content = data.content;
                    if (typeof content === 'string') {
                        try { content = JSON.parse(content); } catch (e) { }
                    }
                    setAboutData(content || { story: '', values: [], whyChoose: [] });
                }
            } else if (tab === 'contact') {
                const res = await fetch(config.endpoints.adminContact, { headers });
                if (res.ok) setContactData(await res.json());
            }
        } catch (error) {
            console.error('Error fetching CMS data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            let url = '';
            let body = {};

            if (activeTab === 'about') {
                url = config.endpoints.adminAbout;
                body = { content: JSON.stringify(aboutData) };
            } else if (activeTab === 'contact') {
                url = config.endpoints.adminContact;
                body = contactData;
            }

            const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });

            if (res.ok) {
                setNotification('Content updated successfully!');
                setTimeout(() => setNotification(''), 3000);
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Error saving:', error);
            setNotification('Error updating content.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>CMS Content Management</h1>
                {notification && <div className="notification-badge">{notification}</div>}
            </div>

            <div className="cms-tabs">
                <button
                    className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => setActiveTab('about')}
                >
                    About Us
                </button>
                <button
                    className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
                    onClick={() => setActiveTab('contact')}
                >
                    Contact Info
                </button>
                <button
                    className={`tab-btn ${activeTab === 'specializations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('specializations')}
                >
                    Specializations
                </button>
                <button
                    className={`tab-btn ${activeTab === 'instruments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('instruments')}
                >
                    Instruments
                </button>
                <button
                    className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    Stats
                </button>
            </div>

            <div className="cms-content card">
                {loading && (activeTab === 'about' || activeTab === 'contact') ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                ) : (
                    <>
                        {activeTab === 'about' && (
                            <TabAbout data={aboutData} setData={setAboutData} />
                        )}

                        {activeTab === 'contact' && (
                            <TabContact data={contactData} setData={setContactData} />
                        )}

                        {(activeTab === 'specializations' || activeTab === 'instruments' || activeTab === 'stats') && (
                            <GenericListTab
                                type={activeTab}
                                endpoint={
                                    activeTab === 'specializations' ? config.endpoints.adminSpecializations :
                                        activeTab === 'instruments' ? config.endpoints.adminInstruments :
                                            config.endpoints.adminStats
                                }
                            />
                        )}

                        {(activeTab === 'about' || activeTab === 'contact') && (
                            <div className="form-actions">
                                <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Sub-components for cleaner code
const TabAbout = ({ data, setData }: any) => (
    <div className="tab-content">
        <div className="form-group">
            <label>Our Story</label>
            <textarea
                value={data.story}
                onChange={(e) => setData({ ...data, story: e.target.value })}
                rows={10}
                className="full-width-input"
            />
        </div>
        <div className="info-box">
            <p>Note: Values and Why Choose sections are complex lists. Please edit raw JSON or use database access for now.</p>
        </div>
    </div>
);

const TabContact = ({ data, setData }: any) => (
    <div className="tab-content">
        <div className="form-group">
            <label>Address</label>
            <textarea
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                rows={3}
            />
        </div>
        <div className="form-group">
            <label>Phone</label>
            <input
                type="text"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
        </div>
        <div className="form-group">
            <label>Email</label>
            <input
                type="text"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
            />
        </div>
        <div className="form-group">
            <label>Google Map Embed URL</label>
            <input
                type="text"
                value={data.map_url || ''}
                onChange={(e) => setData({ ...data, map_url: e.target.value })}
            />
        </div>
    </div>
);

// Generic List Component for Specializations, Instruments, Stats
const GenericListTab = ({ type, endpoint }: { type: string, endpoint: string }) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        fetchItems();
    }, [endpoint]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setItems(await res.json());
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item: any = null) => {
        setEditingItem(item);
        if (item) {
            setFormData({ ...item });
        } else {
            setFormData({});
        }
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchItems();
        } catch (e) {
            alert('Failed to delete');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;
            await fetch(url, {
                method: editingItem ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            setModalOpen(false);
            fetchItems();
        } catch (e) {
            alert('Failed to save');
        }
    };

    if (loading) return <div>Loading list...</div>;

    const renderFormFields = () => {
        if (type === 'stats') {
            return (
                <>
                    <div className="form-group"><label>Label</label><input value={formData.label || ''} onChange={e => setFormData({ ...formData, label: e.target.value })} required /></div>
                    <div className="form-group"><label>Value</label><input value={formData.value || ''} onChange={e => setFormData({ ...formData, value: e.target.value })} required /></div>
                    <div className="form-group"><label>Icon</label><input value={formData.icon || ''} onChange={e => setFormData({ ...formData, icon: e.target.value })} /></div>
                </>
            );
        }
        return (
            <>
                <div className="form-group"><label>Title</label><input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div>
                <div className="form-group"><label>Description</label><textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
                <div className="form-group"><label>Icon</label><input value={formData.icon || ''} onChange={e => setFormData({ ...formData, icon: e.target.value })} /></div>
            </>
        );
    };

    return (
        <div className="tab-content">
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Add Item</button>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        {type === 'stats' ? <><th>Label</th><th>Value</th></> : <><th>Title</th><th>Description</th></>}
                        <th>Icon</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            {type === 'stats' ? (
                                <><td>{item.label}</td><td>{item.value}</td></>
                            ) : (
                                <><td>{item.title}</td><td>{item.description}</td></>
                            )}
                            <td>{item.icon}</td>
                            <td>
                                <button className="btn-icon edit" onClick={() => handleOpenModal(item)}>✏️</button>
                                <button className="btn-icon delete" onClick={() => handleDelete(item.id)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingItem ? 'Edit Item' : 'Add Item'}</h2>
                        <form onSubmit={handleSubmit}>
                            {renderFormFields()}
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CMSPage;
