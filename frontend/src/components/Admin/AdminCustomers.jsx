import { useEffect, useState } from 'react';
import {
  getAllCustomers,
  deactivateCustomer,
  activateCustomer
} from '../../api/customers';
import '../../css/AdminCustomers.css';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (customer) => {
    const isActive = customer.active === 1;
    const action = isActive ? 'deactivate' : 'activate';
    
    if (!window.confirm(`Are you sure you want to ${action} this customer?`)) {
      return;
    }

    try {
      if (isActive) {
        await deactivateCustomer(customer.id);
      } else {
        await activateCustomer(customer.id);
      }
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} customer`);
    }
  };

  if (loading) {
    return (
      <div className="admin-customers">
        <h1>Customer Management</h1>
        <div className="skeleton-container">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-customers">
        <h1>Customer Management</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-customers">
      <header className="page-header">
        <h1>Customers</h1>
        <p className="subtitle">Manage your registered customers</p>
      </header>

      {customers.length === 0 ? (
        <div className="empty-state">
          <p>No customers found in the system.</p>
        </div>
      ) : (
        <div className="customers-container">
          <table className="customers-table desktop-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Registered</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className={customer.active === 0 ? 'inactive-row' : ''}
                >
                  <td>#{customer.id}</td>
                  <td>{customer.name || '—'}</td>
                  <td>{customer.email}</td>
                  <td>
                    {new Date(customer.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td>
                    <span className={`status-badge ${customer.active === 1 ? 'active' : 'inactive'}`}>
                      {customer.active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`action-btn ${customer.active === 1 ? 'deactivate' : 'activate'}`}
                      onClick={() => handleToggleStatus(customer)}
                      disabled={loading}
                    >
                      {customer.active === 1 ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="mobile-cards">
            {customers.map((customer) => (
              <div 
                key={customer.id} 
                className={`customer-card ${customer.active === 0 ? 'inactive' : ''}`}
              >
                <div className="card-header">
                  <div className="customer-info">
                    <span className="customer-name">{customer.name || 'Unnamed'}</span>
                    <span className="customer-id">#{customer.id}</span>
                  </div>
                  <span className={`status-badge ${customer.active === 1 ? 'active' : 'inactive'}`}>
                    {customer.active === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="card-details">
                  <div className="detail-row">
                    <span className="label">Email</span>
                    <span>{customer.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Registered</span>
                    <span>
                      {new Date(customer.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className={`action-btn ${customer.active === 1 ? 'deactivate' : 'activate'}`}
                    onClick={() => handleToggleStatus(customer)}
                  >
                    {customer.active === 1 ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}