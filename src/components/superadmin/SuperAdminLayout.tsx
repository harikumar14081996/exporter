import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './SuperAdminLayout.css';

const SuperAdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [superAdminUser, setSuperAdminUser] = useState<any>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('superAdminToken');
        const user = localStorage.getItem('superAdminUser');

        if (!token || !user) {
            navigate('/superadmin/login');
            return;
        }

        try {
            setSuperAdminUser(JSON.parse(user));
        } catch (e) {
            localStorage.removeItem('superAdminUser');
            navigate('/superadmin/login');
        }
    }, [navigate]);

    // Auto-logout on 401 (expired token)
    useEffect(() => {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            if (response.status === 401 && window.location.pathname.startsWith('/superadmin')) {
                localStorage.removeItem('superAdminToken');
                localStorage.removeItem('superAdminUser');
                window.location.href = '/superadmin/login';
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
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('superAdminToken');
        localStorage.removeItem('superAdminUser');
        navigate('/superadmin/login');
    };

    const handleNavClick = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const navItems = [
        { name: 'Dashboard', path: '/superadmin/dashboard', icon: '📊' },
        { name: 'Manage Admins', path: '/superadmin/admins', icon: '👥' },
        { name: 'Settings', path: '/superadmin/settings', icon: '⚙️' },
        { name: 'Change Password', path: '/superadmin/change-password', icon: '🔑' },
    ];

    if (!superAdminUser) return null;

    return (
        <div className="superadmin-layout">
            {isMobile && (
                <div
                    className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`superadmin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <span className="sidebar-logo">⚡ Super Admin</span>
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

                <div className="sidebar-footer">
                    <div className="admin-user-info">
                        <div className="user-avatar">{superAdminUser.username.charAt(0).toUpperCase()}</div>
                        <div className="user-details">
                            <span className="username">{superAdminUser.username}</span>
                            <span className="role">Super Administrator</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="superadmin-main">
                <header className="superadmin-header">
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

                <main className="superadmin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;
