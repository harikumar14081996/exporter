import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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

    // Auto-logout on 401 (expired token)
    useEffect(() => {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            if (response.status === 401 && window.location.pathname.startsWith('/admin')) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/admin/login';
            }
            return response;
        };
        return () => { window.fetch = originalFetch; };
    }, []);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(true); // Open sidebar on desktop
            } else {
                setSidebarOpen(false); // Close sidebar on mobile by default
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial state

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const handleNavClick = () => {
        // Close sidebar on mobile when clicking a nav item
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Categories', path: '/admin/categories', icon: '📁' },
        { name: 'Products', path: '/admin/products', icon: '📦' },
        { name: 'Sliders', path: '/admin/sliders', icon: '🖼️' },
        { name: 'CMS Content', path: '/admin/cms', icon: '📝' },
        { name: 'Quotes', path: '/admin/quotes', icon: '💬' },
    ];

    if (!adminUser) return null;

    return (
        <div className="admin-layout">
            {/* Mobile Overlay */}
            {isMobile && (
                <div
                    className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

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
                            onClick={handleNavClick}
                        >
                            <span className="link-icon">{item.icon}</span>
                            <span className="link-text">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-divider"></div>

                <nav className="sidebar-nav">
                    <Link
                        to="/admin/change-password"
                        className={`sidebar-link ${location.pathname === '/admin/change-password' ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        <span className="link-icon">🔒</span>
                        <span className="link-text">Change Password</span>
                    </Link>
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
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
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
