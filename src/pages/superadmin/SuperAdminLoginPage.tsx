import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config/api';
import './SuperAdminLoginPage.css';

const SuperAdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(config.endpoints.superAdminLogin, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('superAdminToken', data.token);
                    localStorage.setItem('superAdminUser', JSON.stringify(data.superAdmin));
                    navigate('/superadmin/dashboard');
                } else {
                    setError(data.error || 'Login failed');
                }
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                setError(`Server Error (${response.status}): ${response.statusText}`);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Connection failed. Network error or Server crashed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="superadmin-login-page">
            <div className="superadmin-login-card">
                <div className="login-header">
                    <h2>Super Admin Portal</h2>
                    <p>Shahraj Exporter</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter super admin username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SuperAdminLoginPage;
