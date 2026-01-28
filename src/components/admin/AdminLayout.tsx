import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [adminUser, setAdminUser] = useState<any>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('adminToken');
        const user = localStorage.getItem('adminUser');

        if (!token || !user) {
            navigate('/admin/login');
            return;
        }

        try {
            setAdminUser(JSON.parse(user));
        } catch (e) {
            localStorage.removeItem('adminUser');
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Categories', path: '/admin/categories', icon: '📁' },
        { name: 'Products', path: '/admin/products', icon: '📦' },
        { name: 'Sliders', path: '/admin/sliders', icon: '🖼️' },
        { name: 'CMS Content', path: '/admin/cms', icon: '📝' },
        { name: 'Quotes', path: '/admin/quotes', icon: '💬' },
        { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
    ];

    if (!adminUser) return null;

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <span className="sidebar-logo">Admin Panel</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                        >
                            <span className="link-icon">{item.icon}</span>
                            <span className="link-text">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-user-info">
                        <div className="user-avatar">{adminUser.username.charAt(0).toUpperCase()}</div>
                        <div className="user-details">
                            <span className="username">{adminUser.username}</span>
                            <span className="role">Administrator</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-header">
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ☰
                    </button>

                    <div className="header-actions">
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
