import { useEffect, useState } from 'react';
import { getProducts } from '../api/products';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load products. Please try again later.');
        setLoading(false);
      });
  }, []);

  const styles = {
  page: {
    padding: '30px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '5px',
  },
  subtitle: {
    color: '#64748b',
    marginBottom: '25px',
  },
  info: {
    color: '#475569',
  },
  error: {
    color: '#b42318',
    backgroundColor: '#fdecea',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
  },
  productName: {
    fontSize: '18px',
    marginBottom: '8px',
  },
  description: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '15px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '16px',
    fontWeight: '600',
  },
  stock: {
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '20px',
    fontWeight: '500',
  },
};


  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛒 Cloud Retail Platform</h1>
      <p style={styles.subtitle}>Available Products</p>

      {loading && <p style={styles.info}>Loading products...</p>}

      {error && <p style={styles.error}>{error}</p>}

      {!loading && products.length === 0 && !error && (
        <p style={styles.info}>No products available.</p>
      )}

      <div style={styles.grid}>
        {products.map(product => (
          <div key={product.id} style={styles.card}>
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.description}>
              {product.description || 'No description available'}
            </p>

            <div style={styles.footer}>
              <span style={styles.price}>Rs. {product.price}</span>
              <span
                style={{
                  ...styles.stock,
                  backgroundColor:
                    product.stock > 0 ? '#e6f7ee' : '#fdecea',
                  color: product.stock > 0 ? '#067647' : '#b42318',
                }}
              >
                {product.stock > 0
                  ? `In stock: ${product.stock}`
                  : 'Out of stock'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
