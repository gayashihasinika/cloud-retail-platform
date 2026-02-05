import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../api/products';
import { addToCart, getCart } from '../../api/cart';
import '../../css/CustomerDashboard.css';

export default function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  // Load products
  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load products. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Update cart count
  useEffect(() => {
    const updateCount = () => {
      const cart = getCart() || [];
      const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  const handleAddToCart = (product) => {
    setAddingId(product.id);

    try {
      addToCart(product);
      alert(`${product.name} added to cart!`);

      // Update count immediately
      const cart = getCart() || [];
      const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    } catch (err) {
      alert('Failed to add to cart');
      console.error(err);
    } finally {
      setAddingId(null);
    }
  };

  const goToCart = () => navigate('/cart');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="customer-dashboard">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="logo-title">
            <span className="emoji">🛍️</span>
            <h1>Cloud Retail</h1>
          </div>

          <div className="nav-actions">
            <button className="cart-button" onClick={goToCart} title="View Cart">
              🛒 Cart
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <h2>Discover Our Products</h2>
          <p>Explore and shop the best items today</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading amazing products...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">😔</div>
            <h2>No products available</h2>
            <p>Please check back later or contact support.</p>
          </div>
        )}

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {/* Product Image */}
              <div className="product-image-container">
                <img
                  src={
                    product.image
                      ? `http://127.0.0.1:8001/storage/${product.image}`
                      : 'https://via.placeholder.com/400x300?text=No+Image'
                  }
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">
                  {product.description || 'No description available'}
                </p>

                <div className="product-meta">
                  <div className="price">Rs. {Number(product.price).toLocaleString()}</div>
                  <div className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {product.stock > 0 ? (
                <button
                  className="add-to-cart-btn"
                  disabled={addingId === product.id}
                  onClick={() => handleAddToCart(product)}
                >
                  {addingId === product.id ? 'Adding...' : 'Add to Cart'}
                </button>
              ) : (
                <button className="add-to-cart-btn disabled" disabled>
                  Out of Stock
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}