import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config/api';
import './ChangePasswordPage.css';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.oldPassword) {
            newErrors.oldPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'New password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.oldPassword && formData.newPassword && formData.oldPassword === formData.newPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setSubmitSuccess(false);

        try {
            const token = localStorage.getItem('adminToken');

            const response = await fetch(config.endpoints.adminChangePassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitSuccess(true);
                setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    navigate('/admin/dashboard');
                }, 2000);
            } else {
                setErrors({
                    submit: data.error || 'Failed to change password'
                });
            }
        } catch (error: any) {
            setErrors({
                submit: error.message || 'Failed to change password'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="change-password-page">
            <div className="change-password-container">
                <h1>Change Password</h1>
                <p className="page-description">Update your admin account password</p>

                <form onSubmit={handleSubmit} className="change-password-form">
                    <div className="form-group">
                        <label htmlFor="oldPassword">Current Password *</label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            className={errors.oldPassword ? 'error' : ''}
                            placeholder="Enter current password"
                        />
                        {errors.oldPassword && <span className="error-message">{errors.oldPassword}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password *</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={errors.newPassword ? 'error' : ''}
                            placeholder="Enter new password (min 6 characters)"
                        />
                        {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                            placeholder="Re-enter new password"
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    {errors.submit && (
                        <div className="error-alert">
                            {errors.submit}
                        </div>
                    )}

                    {submitSuccess && (
                        <div className="success-alert">
                            Password changed successfully! Redirecting to dashboard...
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/admin/dashboard')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
