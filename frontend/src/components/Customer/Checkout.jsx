import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, clearCart } from '../../api/cart';
import { createOrderFromCart } from '../../api/orders';
import '../../css/Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const items = getCart() || [];
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(items);
    const amount = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      return sum + price * (item.quantity || 1);
    }, 0);
    setTotal(amount);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        shipping_address: {
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postal_code: formData.postalCode.trim(),
          notes: formData.notes.trim(),
        },
        total_amount: total,
      };

      await createOrderFromCart(orderData);
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase.</p>
          <p className="success-subtext">
            Your order is being processed. We'll notify you soon.
          </p>
          <button
            className="return-btn"
            onClick={() => navigate('/customer-dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-grid">
          {/* Order Summary */}
          <div className="summary-card card">
            <h2 className="section-title">Order Summary</h2>

            <div className="items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">× {item.quantity}</span>
                  </div>
                  <span className="item-total">
                    Rs. {(Number(item.price) * item.quantity).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className="total-section">
              <div className="total-row">
                <span>Total Amount</span>
                <strong className="grand-total">
                  Rs. {total.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <div className="form-card card">
            <h2 className="section-title">Shipping Details</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0771234567"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address, apartment, suite..."
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Colombo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="10350"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Order Notes (optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special instructions for delivery..."
                  rows={2}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="submit-btn"
                disabled={loading || cartItems.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}