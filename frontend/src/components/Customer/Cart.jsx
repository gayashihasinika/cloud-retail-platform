import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateCartQuantity, clearCart } from '../../api/cart';
import '../../css/Cart.css';

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    const items = getCart();
    setCartItems(items || []);
    calculateTotal(items || []);
    setLoading(false);
  }, []);

  const calculateTotal = (items) => {
    const amount = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    setTotal(amount);
  };

  const handleRemove = (productId) => {
    const updated = removeFromCart(productId);
    setCartItems(updated);
    calculateTotal(updated);
  };

  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) return;
    const updated = updateCartQuantity(productId, newQty);
    setCartItems(updated);
    calculateTotal(updated);
  };

  const handleClearCart = () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    clearCart();
    setCartItems([]);
    setTotal(0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1>Your Shopping Cart</h1>
          <div className="skeleton-loader">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-item" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Your Shopping Cart</h1>

        {/* Success Message */}
        {checkoutSuccess && (
          <div className="success-overlay">
            <div className="success-card">
              <div className="success-icon">🎉</div>
              <h2>Order Placed!</h2>
              <p>Thank you for shopping with us. Your order is being processed.</p>
              <button className="home-btn" onClick={() => navigate('/')}>
                Return to Home
              </button>
            </div>
          </div>
        )}

        {/* Empty Cart */}
        {!checkoutSuccess && cartItems.length === 0 && (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <button className="continue-btn" onClick={() => navigate('/customer-dashboard')}>
              Continue Shopping
            </button>
          </div>
        )}

        {/* Cart Items + Summary */}
        {!checkoutSuccess && cartItems.length > 0 && (
          <div className="cart-content">
            {/* Items List */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    {item.description && (
                      <p className="item-desc">{item.description.substring(0, 80)}...</p>
                    )}
                  </div>

                  <div className="item-price">
                    Rs. {Number(item.price).toFixed(2)}
                  </div>

                  <div className="item-quantity">
                    <button
                      className="qty-btn minus"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn plus"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-subtotal">
                    Rs. {(Number(item.price) * item.quantity).toFixed(2)}
                  </div>

                  <button
                    className="remove-item-btn"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="cart-summary-card">
              <h3>Order Summary</h3>

              <div className="summary-line">
                <span>Subtotal</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>

              <div className="summary-line">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <strong>Rs. {total.toFixed(2)}</strong>
              </div>

              {error && <div className="error-text">{error}</div>}

              <div className="summary-actions">
                <button className="clear-btn" onClick={handleClearCart}>
                  Clear Cart
                </button>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}