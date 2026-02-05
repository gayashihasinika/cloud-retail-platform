import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  History, 
  LogOut,
  Menu,
  X
} from 'lucide-react'; // npm install lucide-react

import '../css/Layout.css';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    window.location.href = '/';
  };

  return (
    <div className="customer-layout">
      {/* Mobile Hamburger Button */}
      <button 
        className="mobile-toggle-btn"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar / Drawer */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">
            <ShoppingCart size={28} className="logo-icon" />
            <span>Shop</span>
          </h2>
          <button 
            className="close-mobile-btn" 
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="menu">
          <NavLink 
            to="/customer-dashboard" 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/cart" 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
          </NavLink>

          <NavLink 
            to="/order-history" 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <History size={20} />
            <span>Order History</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div className="mobile-backdrop" onClick={closeMobileMenu} />
      )}
    </div>
  );
}