import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../../api/orders';
import '../../css/CustomerOrders.css';

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Unable to load your orders. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">Your Order History</h1>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        )}

        {!loading && error && <div className="error-message">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders.</p>
            <button className="shop-now-btn" onClick={() => navigate('/customer-dashboard')}>
              Start Shopping
            </button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <>
            {/* Desktop Table View */}
            <div className="desktop-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Items</th>
                    <th>Date</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id">#{order.id}</td>

                      <td className="order-items">
                        <div className="items-preview">
                          {order.products.length > 3 && (
                            <span className="more-count">+{order.products.length - 3}</span>
                          )}
                        </div>
                        <span className="item-names">
                          {order.products.map((p, index) => (
                            <span key={p.id}>
                              {p.name}
                              {index < order.products.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </span>
                      </td>

                      <td className="order-date">
                        {new Date(order.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="order-total">
                        Rs. {Number(order.total_amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-orders">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">Order #{order.id}</span>
                    <span className="order-date">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                 

                  <div className="order-items-list">
                    {order.products.map((p) => (
                      <div key={p.id} className="mobile-item-row">
                        <span>{p.name}</span>
                        <span>× {p.quantity || 1}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-total-row">
                    <span>Total:</span>
                    <strong>
                      Rs. {Number(order.total_amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}