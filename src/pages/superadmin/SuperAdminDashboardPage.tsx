import './SuperAdminDashboardPage.css';

const SuperAdminDashboardPage = () => {
    return (
        <div className="superadmin-dashboard">
            <h1>Super Admin Dashboard</h1>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <div className="card-icon">👥</div>
                    <div className="card-content">
                        <h3>Manage Admins</h3>
                        <p>Create, edit, and delete admin accounts</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon">⚙️</div>
                    <div className="card-content">
                        <h3>System Settings</h3>
                        <p>Configure website theme and branding</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon">🔒</div>
                    <div className="card-content">
                        <h3>Security</h3>
                        <p>Manage permissions and access control</p>
                    </div>
                </div>
            </div>

            <div className="welcome-section">
                <h2>Welcome to Super Admin Portal</h2>
                <p>You have full control over the system. Use the navigation menu to manage admins and configure settings.</p>
            </div>
        </div>
    );
};

export default SuperAdminDashboardPage;
