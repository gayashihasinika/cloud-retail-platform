// AdminDashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/AdminDashboard.css';

const PRODUCT_API_URL = import.meta.env.VITE_PRODUCT_API_URL;

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${PRODUCT_API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let data = products;

    if (search.trim()) {
      data = data.filter((p) =>
        (p.name || '')
  .toLowerCase()
  .includes(search.toLowerCase().trim())

      );
    }

    if (categoryFilter !== 'all') {
      data = data.filter(
  (p) =>
    p.category &&
    p.category.toLowerCase() === categoryFilter.toLowerCase()
);

    }

    setFiltered(data);
  }, [search, categoryFilter, products]);

  const openForm = (mode, product = null) => {
    setFormMode(mode);
    setFormData(
      product
        ? { ...product, image: null }
        : { name: '', description: '', price: '', stock: '', category: '', image: null }
    );
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    try {
      if (formMode === 'add') {
        await axios.post(`${PRODUCT_API_URL}/products`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          `${PRODUCT_API_URL}/products/${formData.id}?_method=PUT`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      alert('Error saving product');
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="header">
        <h1>Product Management</h1>
        <button className="btn primary" onClick={() => openForm('add')}>
          + Add Product
        </button>
      </header>

      <div className="controls">
        <div className="search-wrapper">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-select"
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="grocery">Grocery</option>
          <option value="fashion">Fashion</option>
        </select>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="skeleton-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="products-grid">
          {filtered.length === 0 ? (
            <p className="no-results">No products found</p>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="product-card">
                <div className="card-image">
                  <img
                    src={
                      p.image
                        ? `${PRODUCT_API_URL}/storage/${p.image}`
                        : '/placeholder.png'
                    }
                    alt={p.name}
                  />
                </div>
                <div className="card-content">
                  <h3>{p.name}</h3>
                  <p className="description">{p.description}</p>

                  <div className="meta">
                    <span className="price">Rs. {p.price}</span>
                    <span className={`stock ${p.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {p.stock > 0 ? `Stock: ${p.stock}` : 'Out of stock'}
                    </span>
                  </div>

                  <div className="card-actions">
                    <button className="btn edit" onClick={() => openForm('edit', p)}>
                      Edit
                    </button>
                    <button className="btn delete">Disable</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{formMode === 'add' ? 'Add New Product' : 'Edit Product'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Price (Rs.)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group half">
                  <label>Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. electronics"
                />
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <input name="image" type="file" onChange={handleChange} accept="image/*" />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn primary">
                  Save Product
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}