import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaTrash, FaArrowLeft, FaSync } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './AdminOrders.css';



const AdminOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); 

  useEffect(() => {
  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/');
    return;
  }
  fetchOrders();
}, [isAuthenticated, user, navigate, refreshKey]); 

const fetchOrders = async () => {
  console.log('🔄 FETCH ORDERS CALLED!');
  try {
    setLoading(true);
    console.log('📡 Making API request to /admin/orders...');
    const response = await axios.get('/admin/orders');
    console.log('✅ API Response:', response.data);
    setOrders(response.data.orders || []);
    setError('');
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    setError('Failed to load orders');
  } finally {
    setLoading(false);
    console.log('✅ Loading set to false');
  }
};

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      setDeleteLoading(orderId);
      await axios.delete(`/admin/orders/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
      alert('Order deleted successfully');
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusClass = (status) => {
    return status ? status.toLowerCase() : 'pending';
  };

  if (loading) {
    return (
      <div className="admin-orders-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <div className="admin-orders-header">
  <Link to="/admin" className="back-link">
    <FaArrowLeft /> Back to Dashboard
  </Link>
  <div className="header-content">
    <div>
      <h1>Orders Management</h1>
      <p>Manage all customer orders</p>
    </div>
    <button 
  onClick={() => {
    fetchOrders();
    setRefreshKey(prev => prev + 1);
  }} 
  className="refresh-btn" 
  disabled={loading}
>
  <FaSync /> {loading ? 'Refreshing...' : 'Refresh Orders'}
</button>
  </div>
</div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchOrders}>Retry</button>
        </div>
      )}

      <div className="orders-stats">
        <div className="stat-box">
          <h3>Total Orders</h3>
          <p className="stat-number">{orders.length}</p>
        </div>
        <div className="stat-box">
          <h3>Pending</h3>
          <p className="stat-number pending">
            {orders.filter(o => o.orderStatus === 'Pending' || !o.orderStatus).length}
          </p>
        </div>
        <div className="stat-box">
          <h3>Processing</h3>
          <p className="stat-number processing">
            {orders.filter(o => o.orderStatus === 'Processing').length}
          </p>
        </div>
        <div className="stat-box">
          <h3>Delivered</h3>
          <p className="stat-number delivered">
            {orders.filter(o => o.orderStatus === 'Delivered').length}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>No Orders Yet</h2>
          <p>Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">#{order._id.slice(-8).toUpperCase()}</td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.user?.name || 'N/A'}</strong>
                      <small>{order.user?.email || ''}</small>
                    </div>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.orderItems.length} items</td>
                  <td className="price">Rs {order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`payment-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                      {order.isPaid ? 'Paid' : 'Not Paid'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="actions">
                    <Link 
                      to={`/admin/orders/${order._id}`} 
                      className="action-btn view-btn"
                      title="View Details"
                    >
                      <FaEye />
                    </Link>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="action-btn delete-btn"
                      disabled={deleteLoading === order._id}
                      title="Delete Order"
                    >
                      {deleteLoading === order._id ? '...' : <FaTrash />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;