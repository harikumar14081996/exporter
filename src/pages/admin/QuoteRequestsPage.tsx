import { useState, useEffect } from 'react';
import { config } from '../../config/api';
import './QuoteRequestsPage.css';

const QuoteRequestsPage = () => {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuote, setSelectedQuote] = useState<any>(null);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(config.endpoints.adminQuotes, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setQuotes(data);
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewQuote = (quote: any) => {
        setSelectedQuote(quote);
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${config.endpoints.adminQuotes}/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update local state
                setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const closeModal = () => {
        setSelectedQuote(null);
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Quote Requests</h1>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Product Interest</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map((quote) => (
                            <tr key={quote.id}>
                                <td>{new Date(quote.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ fontWeight: '500' }}>{quote.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{quote.email}</div>
                                </td>
                                <td>{quote.company || '-'}</td>
                                <td>{quote.product_interest || '-'}</td>
                                <td>
                                    <select
                                        value={quote.status || 'New'}
                                        onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                                        className={`status-select ${quote.status?.toLowerCase() || 'new'}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <option value="New">New</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Processed">Processed</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className="btn-primary"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                        onClick={() => handleViewQuote(quote)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {quotes.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No quote requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedQuote && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Quote Details</h2>
                        <div className="quote-details">
                            <div className="detail-row"><strong>Name:</strong> {selectedQuote.name}</div>
                            <div className="detail-row"><strong>Email:</strong> {selectedQuote.email}</div>
                            <div className="detail-row"><strong>Phone:</strong> {selectedQuote.phone || '-'}</div>
                            <div className="detail-row"><strong>Company:</strong> {selectedQuote.company || '-'}</div>
                            <div className="detail-row"><strong>Product Interest:</strong> {selectedQuote.product_interest || '-'}</div>
                            <div className="detail-row"><strong>Quantity:</strong> {selectedQuote.quantity || '-'}</div>
                            <div className="detail-row"><strong>Date:</strong> {new Date(selectedQuote.created_at).toLocaleString()}</div>
                            <div className="detail-row full-width">
                                <strong>Message:</strong>
                                <p className="message-box">{selectedQuote.message || 'No message provided.'}</p>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuoteRequestsPage;
