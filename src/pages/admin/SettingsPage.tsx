import { useState, useEffect } from 'react';
import { config } from '../../config/api';
import './SettingsPage.css';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        website_name: '',
        theme_color: '#0066cc',
        copyright_text: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            // Check if we're in super admin panel or admin panel
            const superAdminToken = localStorage.getItem('superAdminToken');
            const adminToken = localStorage.getItem('adminToken');
            const token = superAdminToken || adminToken;

            const response = await fetch(config.endpoints.adminSettings, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setSettings({
                    website_name: data.website_name || '',
                    theme_color: data.theme_color || '#0066cc',
                    copyright_text: data.copyright_text || ''
                });
            } else {
                setError('Failed to load settings');
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Error loading settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setNotification('');
        setError('');

        try {
            // Use super admin token for authentication
            const token = localStorage.getItem('superAdminToken');

            const response = await fetch(config.endpoints.adminSettings, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setNotification('Settings updated successfully');
                setTimeout(() => setNotification(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update settings');
            }
        } catch (err) {
            console.error('Error updating settings:', err);
            setError('Error updating settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="loading">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Website Settings</h1>
                {notification && <div className="notification-badge success">{notification}</div>}
                {error && <div className="notification-badge error">{error}</div>}
            </div>

            <div className="card settings-card">
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Website Name</label>
                        <input
                            type="text"
                            value={settings.website_name}
                            onChange={(e) => setSettings({ ...settings, website_name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Theme Color</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                type="color"
                                value={settings.theme_color}
                                onChange={(e) => setSettings({ ...settings, theme_color: e.target.value })}
                                style={{ width: '50px', height: '40px', padding: '0', border: 'none' }}
                            />
                            <input
                                type="text"
                                value={settings.theme_color}
                                onChange={(e) => setSettings({ ...settings, theme_color: e.target.value })}
                                style={{ width: '120px' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Copyright Text</label>
                        <input
                            type="text"
                            value={settings.copyright_text}
                            onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
