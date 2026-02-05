// frontend/src/components/Admin/AdminBoard.jsx
import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../api/adminDashboard';
import '../../css/AdminBoard.css';

export default function AdminBoard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getAdminDashboard();
        setStats(data);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) return <div className="dashboard-error">{error}</div>;
  if (!stats) return <div className="dashboard-empty">No data available</div>;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Store Overview</h1>
        <p className="dashboard-subtitle">Quick glance at your business today</p>
      </header>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon products">📦</div>
            <h3>Total Products</h3>
            <div className="stat-value">{stats.total_products ?? 0}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders">🛒</div>
            <h3>Total Orders</h3>
            <div className="stat-value">{stats.total_orders ?? 0}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon customers">👥</div>
            <h3>Total Customers</h3>
            <div className="stat-value">{stats.total_customers ?? 0}</div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon active">✅</div>
            <h3>Active Customers</h3>
            <div className="stat-value">{stats.active_customers ?? 0}</div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon inactive">🚫</div>
            <h3>Deactivated</h3>
            <div className="stat-value">{stats.deactivated_customers ?? 0}</div>
          </div>

          <div className="stat-card highlight">
            <div className="stat-icon today">📅</div>
            <h3>Today’s Orders</h3>
            <div className="stat-value">{stats.today_orders ?? 0}</div>
          </div>
        </div>
      </section>

      <section className="recent-orders-section">
        <h2>Recent Orders</h2>

        {stats.recent_orders?.length === 0 ? (
          <div className="empty-state">
            <p>No recent orders found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="recent-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">#{order.id}</td>
                    <td>Customer #{order.customer_id}</td>
                    <td>{new Date(order.created_at).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}