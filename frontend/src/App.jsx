import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './components/Login';
import Signup from './components/Signup';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import Cart from './components/Customer/Cart';
import Checkout from './components/Customer/Checkout';
import OrderHistory from './components/Customer/OrderHistory';

import AdminDashboard from './components/Admin/AdminDashboard';
import AdminOrders from './components/Admin/AdminOrders';
import AdminCustomers from './components/Admin/AdminCustomers';
import AdminBoard from './components/Admin/AdminBoard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setToken={() => { }} />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<MainLayout />}>
          <Route
            path="/customer-dashboard"
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute role="customer">
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="customer">
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-history"
            element={
              <ProtectedRoute role="customer">
                <OrderHistory />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<AdminLayout />}>
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-orders"
          element={
            <ProtectedRoute role="admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-customers"
          element={
            <ProtectedRoute role="admin">
              <AdminCustomers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-board"
          element={
            <ProtectedRoute role="admin">
              <AdminBoard />
            </ProtectedRoute>
          }
        />
        
        </Route>
      </Routes>
    </Router>
  );
}
