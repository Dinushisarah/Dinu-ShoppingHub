import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaCalendar, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import './Orders.css';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please login to view your orders');
      setLoading(false);
      return;
    }

    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders/myorders');
      setOrders(response.data.orders || response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'Shipped':
        return <FaTruck className="status-icon shipped" />;
      case 'Processing':
        return <FaShoppingBag className="status-icon processing" />;
      default:
        return <FaShoppingBag className="status-icon pending" />;
    }
  };

  const getStatusClass = (status) => {
    return status ? status.toLowerCase() : 'pending';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-empty">
        <h2>Please Login</h2>
        <p>You need to be logged in to view your orders</p>
        <Link to="/login" className="login-btn">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error">
        <h2>Error Loading Orders</h2>
        <p>{error}</p>
        <button onClick={fetchOrders} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <FaShoppingBag className="empty-icon" />
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet</p>
        <Link to="/" className="shop-now-btn">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Total Orders: {orders.length}</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div className="order-info">
                <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                <p className="order-date">
                  <FaCalendar /> {formatDate(order.createdAt)}
                </p>
              </div>
              <div className={`order-status ${getStatusClass(order.orderStatus)}`}>
                {getStatusIcon(order.orderStatus)}
                <span>{order.orderStatus || 'Pending'}</span>
              </div>
            </div>

            <div className="order-items">
              {order.orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <div className="order-total">
                <span>Total Amount:</span>
                <span className="total-price">Rs {order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="order-actions">
                <Link to={`/order/${order._id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>

            <div className="order-shipping">
              <p>
                <strong>Shipping to:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>
                <strong>Payment:</strong> {order.paymentMethod}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;