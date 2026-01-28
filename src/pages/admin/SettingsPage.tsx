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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState('');
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        // Initial check or simple fetch if we were already verified? 
        // For security, we ask for password again or check a "superAdmin" flag in token?
        // The requirement says "Hidden super admin settings page" and "Password verification modal".
        // Let's implement a lock screen first.
        setLoading(false);
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            // We use the protected GET endpoint if it exists, or the public one?
            // backend/routes/superAdmin.js has router.get('/settings', authenticateToken, ...)
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
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleVerifyParams = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(config.endpoints.adminVerify, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ superAdminPassword: password })
            });

            if (response.ok) {
                setIsAuthenticated(true);
                fetchSettings();
            } else {
                setAuthError('Incorrect super admin password');
            }
        } catch (error) {
            setAuthError('Verification failed');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setNotification('');

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(config.endpoints.adminSettings, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...settings,
                    superAdminPassword: password
                })
            });

            if (response.ok) {
                setNotification('Settings updated successfully');
                setTimeout(() => setNotification(''), 3000);
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            setNotification('Error updating settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated) {
        return (
            <div className="admin-page">
                <div className="page-header">
                    <h1>Super Admin Settings</h1>
                </div>
                <div className="card auth-card">
                    <h2>Security Verification</h2>
                    <p>Please enter the super admin password to access these settings.</p>
                    <form onSubmit={handleVerifyParams}>
                        <div className="form-group">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Super Admin Password"
                                required
                                className="auth-input"
                            />
                        </div>
                        {authError && <div className="error-message">{authError}</div>}
                        <button type="submit" className="btn btn-primary btn-block">Verify Access</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Website Settings</h1>
                {notification && <div className="notification-badge">{notification}</div>}
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
