import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBox, FaUsers, FaDollarSign, FaEye } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/stats');
      setStats(response.data.stats);
      setRecentOrders(response.data.recentOrders || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card sales">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>Total Sales</h3>
            <p className="stat-value">Rs {stats.totalSales.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">
            <FaBox />
          </div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/products" className="action-btn products-btn">
            <FaBox /> Manage Products
          </Link>
          <Link to="/admin/orders" className="action-btn orders-btn">
            <FaShoppingCart /> Manage Orders
          </Link>
          <Link to="/admin/users" className="action-btn users-btn">
            <FaUsers /> Manage Users
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders" className="view-all">View All</Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <p className="no-data">No recent orders</p>
        ) : (
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-8).toUpperCase()}</td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>Rs {order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${order.orderStatus?.toLowerCase() || 'pending'}`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order._id}`} className="view-btn">
                        <FaEye /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;