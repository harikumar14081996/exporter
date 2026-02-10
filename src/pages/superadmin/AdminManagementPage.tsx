import { useState, useEffect } from 'react';
import { config } from '../../config/api';
import './AdminManagementPage.css';

interface Admin {
    id: number;
    username: string;
    created_at: string;
}

const AdminManagementPage = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [resetPassword, setResetPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem('superAdminToken');
            const response = await fetch(config.endpoints.superAdminAdmins, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAdmins(data);
            } else {
                setError('Failed to fetch admins');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('superAdminToken');
            const response = await fetch(config.endpoints.superAdminAdmins, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Admin created successfully');
                setShowAddModal(false);
                setFormData({ username: '', password: '' });
                fetchAdmins();
            } else {
                setError(data.error || 'Failed to create admin');
            }
        } catch (err) {
            setError('Connection error');
        }
    };

    const handleEditAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAdmin) return;
        setError('');

        try {
            const token = localStorage.getItem('superAdminToken');
            const response = await fetch(`${config.endpoints.superAdminAdmins}/${selectedAdmin.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: formData.username })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Admin updated successfully');
                setShowEditModal(false);
                setSelectedAdmin(null);
                fetchAdmins();
            } else {
                setError(data.error || 'Failed to update admin');
            }
        } catch (err) {
            setError('Connection error');
        }
    };

    const handleDeleteAdmin = async (id: number) => {
        if (!confirm('Are you sure you want to delete this admin?')) return;
        setError('');

        try {
            const token = localStorage.getItem('superAdminToken');
            const response = await fetch(`${config.endpoints.superAdminAdmins}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setSuccess('Admin deleted successfully');
                fetchAdmins();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to delete admin');
            }
        } catch (err) {
            setError('Connection error');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAdmin) return;
        setError('');

        try {
            const token = localStorage.getItem('superAdminToken');
            const response = await fetch(`${config.endpoints.superAdminAdmins}/${selectedAdmin.id}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword: resetPassword })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password reset successfully');
                setShowResetPasswordModal(false);
                setSelectedAdmin(null);
                setResetPassword('');
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('Connection error');
        }
    };

    const openAddModal = () => {
        setFormData({ username: '', password: '' });
        setError('');
        setShowAddModal(true);
    };

    const openEditModal = (admin: Admin) => {
        setSelectedAdmin(admin);
        setFormData({ username: admin.username, password: '' });
        setError('');
        setShowEditModal(true);
    };

    const openResetPasswordModal = (admin: Admin) => {
        setSelectedAdmin(admin);
        setResetPassword('');
        setError('');
        setShowResetPasswordModal(true);
    };

    if (loading) return <div className="loading">Loading admins...</div>;

    return (
        <div className="admin-management-page">
            <div className="page-header">
                <h1>Manage Admins</h1>
                <button className="btn-primary" onClick={openAddModal}>+ Add Admin</button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="admins-table-container">
                <table className="admins-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin.id}>
                                <td>{admin.id}</td>
                                <td>{admin.username}</td>
                                <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                                <td className="actions">
                                    <button className="btn-edit" onClick={() => openEditModal(admin)}>Edit</button>
                                    <button className="btn-reset" onClick={() => openResetPasswordModal(admin)}>Reset Password</button>
                                    <button className="btn-delete" onClick={() => handleDeleteAdmin(admin.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Admin</h2>
                        <form onSubmit={handleAddAdmin}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password (min 6 characters)</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Create Admin</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Admin Modal */}
            {showEditModal && selectedAdmin && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Edit Admin</h2>
                        <form onSubmit={handleEditAdmin}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetPasswordModal && selectedAdmin && (
                <div className="modal-overlay" onClick={() => setShowResetPasswordModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Reset Password for {selectedAdmin.username}</h2>
                        <form onSubmit={handleResetPassword}>
                            <div className="form-group">
                                <label>New Password (min 6 characters)</label>
                                <input
                                    type="password"
                                    value={resetPassword}
                                    onChange={(e) => setResetPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowResetPasswordModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Reset Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagementPage;
