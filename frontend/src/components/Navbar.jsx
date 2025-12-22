import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/cart';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h2>Dinu ShoppingHub</h2>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link admin-link">
              Admin Dashboard
            </Link>
          )}

          <Link to="/cart" className="nav-link cart-link">
            <FaShoppingCart />
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-link">
                <FaUser /> Profile
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link login-btn">
                Login
              </Link>
              <Link to="/register" className="nav-link register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;