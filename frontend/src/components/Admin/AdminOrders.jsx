import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/Orders.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8002/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://127.0.0.1:8002/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistic update + refresh
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update order status');
      fetchOrders(); // rollback on error
    }
  };

  if (loading) {
    return (
      <div className="admin-orders">
        <h1>Orders</h1>
        <div className="skeleton-container">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders">
        <h1>Orders</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <header className="orders-header">
        <h1>Orders Management</h1>
        <p className="subtitle">View and update customer orders</p>
      </header>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  <td>Customer #{order.customer_id}</td>
                  <td className="total">Rs. {Number(order.total_amount).toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className={`status-select status-${order.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="date">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}