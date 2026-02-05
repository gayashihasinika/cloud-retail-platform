// AdminLayout.jsx
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react'; // ← install: npm install lucide-react

import '../css/AdminLayout.css';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  return (
    <div className="admin-layout">
      {/* Mobile Hamburger */}
      <button 
        className="mobile-menu-btn"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">
            <Package size={28} className="logo-icon" />
            <span>Store Manager</span>
          </h2>
          <button 
            className="close-btn" 
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          <NavLink 
            to="/admin-board" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/admin-dashboard" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Package size={20} />
            <span>Products</span>
          </NavLink>

          <NavLink 
            to="/admin-orders" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <ShoppingCart size={20} />
            <span>Orders</span>
          </NavLink>

          <NavLink 
            to="/admin-customers" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Users size={20} />
            <span>Customers</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar} />
      )}
    </div>
  );
}