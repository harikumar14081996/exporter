import { useState, useEffect } from 'react';
import { config } from '../../config/api';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        pendingQuotes: 0,
        totalVisits: 0
    });
    const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch Stats
            const statsRes = await fetch(`${config.endpoints.adminLogin.replace('/login', '')}/dashboard/stats`, { headers });

            // Fetch Recent Quotes (reuse existing endpoint or use limit?)
            // We'll use the quotes endpoint and slice top 5 for now
            const quotesRes = await fetch(config.endpoints.adminQuotes, { headers });

            if (statsRes.ok) {
                setStats(await statsRes.json());
            }

            if (quotesRes.ok) {
                const quotesData = await quotesRes.json();
                setRecentQuotes(quotesData.slice(0, 5));
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="admin-page">Loading dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <h1 className="admin-page-title">Dashboard</h1>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon bg-blue">📦</div>
                    <div className="stat-info">
                        <h3>Total Products</h3>
                        <p className="stat-value">{stats.totalProducts}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-green">📁</div>
                    <div className="stat-info">
                        <h3>Categories</h3>
                        <p className="stat-value">{stats.totalCategories}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-purple">💬</div>
                    <div className="stat-info">
                        <h3>Pending Quotes</h3>
                        <p className="stat-value">{stats.pendingQuotes}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-orange">👁️</div>
                    <div className="stat-info">
                        <h3>Total Visits</h3>
                        <p className="stat-value">{stats.totalVisits}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-activity">
                    <h2>Recent Quote Requests</h2>
                    {recentQuotes.length === 0 ? (
                        <div className="empty-state">
                            <p>No recent activity</p>
                        </div>
                    ) : (
                        <div className="activity-list">
                            {recentQuotes.map(quote => (
                                <div key={quote.id} className="activity-item">
                                    <div className="activity-icon">📝</div>
                                    <div className="activity-details">
                                        <h4>{quote.name}</h4>
                                        <p>{quote.company} - {quote.status}</p>
                                        <span className="activity-time">{new Date(quote.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`status-tag ${quote.status?.toLowerCase() || 'pending'}`}>
                                        {quote.status || 'Pending'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
