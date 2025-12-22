import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendar, FaMapMarkerAlt, FaCreditCard, FaBox } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './AdminOrderDetail.css';

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrderDetails();
  }, [orderId, isAuthenticated, user, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/orders/${orderId}`);
      setOrder(response.data.order || response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Change order status to ${newStatus}?`)) {
      return;
    }

    try {
      setUpdating(true);
      const response = await axios.put(`/admin/orders/${orderId}`, {
        orderStatus: newStatus,
      });
      setOrder(response.data.order);
      alert('Order status updated successfully!');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusChange = async () => {
    const newPaidStatus = !order.isPaid;
    
    if (!window.confirm(`Mark this order as ${newPaidStatus ? 'PAID' : 'UNPAID'}?`)) {
      return;
    }

    try {
      setUpdating(true);
      const response = await axios.put(`/admin/orders/${orderId}`, {
        isPaid: newPaidStatus,
      });
      setOrder(response.data.order);
      alert(`Order marked as ${newPaidStatus ? 'Paid' : 'Unpaid'}!`);
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
      <div className="admin-order-detail-loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="admin-order-detail-error">
        <h2>Order Not Found</h2>
        <p>{error}</p>
        <Link to="/admin/orders" className="back-btn">
          <FaArrowLeft /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-order-detail-container">
      <Link to="/admin/orders" className="back-link">
        <FaArrowLeft /> Back to Orders
      </Link>

      <div className="admin-order-detail-header">
        <div className="order-header-left">
          <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="order-date">
            <FaCalendar /> Placed on {formatDate(order.createdAt)}
          </p>
          <p className="customer-name">
            Customer: <strong>{order.user?.name || 'N/A'}</strong> ({order.user?.email || 'N/A'})
          </p>
        </div>
        <div className={`order-status-badge ${getStatusClass(order.orderStatus)}`}>
          {order.orderStatus || 'Pending'}
        </div>
      </div>

      {/* Admin Controls */}
      <div className="admin-controls-section">
        <h2>Admin Controls</h2>
        <div className="admin-controls">
          <div className="control-group">
            <h3>Update Order Status</h3>
            <p className="current-status-text">
              Current Status: <strong>{order.orderStatus || 'Pending'}</strong>
            </p>
            <div className="status-buttons">
              <button
                onClick={() => handleStatusChange('Processing')}
                className={`status-btn processing ${order.orderStatus === 'Processing' ? 'active' : ''}`}
                disabled={updating}
              >
                {order.orderStatus === 'Processing' && '✓ '} Processing
              </button>
              <button
                onClick={() => handleStatusChange('Shipped')}
                className={`status-btn shipped ${order.orderStatus === 'Shipped' ? 'active' : ''}`}
                disabled={updating}
              >
                {order.orderStatus === 'Shipped' && '✓ '} Shipped
              </button>
              <button
                onClick={() => handleStatusChange('Delivered')}
                className={`status-btn delivered ${order.orderStatus === 'Delivered' ? 'active' : ''}`}
                disabled={updating}
              >
                {order.orderStatus === 'Delivered' && '✓ '} Delivered
              </button>
            </div>
          </div>

          <div className="control-group">
            <h3>Payment Status</h3>
            <button
              onClick={handlePaymentStatusChange}
              className={`payment-toggle-btn ${order.isPaid ? 'paid' : 'unpaid'}`}
              disabled={updating}
            >
              {order.isPaid ? '✓ Mark as Unpaid' : '✓ Mark as Paid'}
            </button>
            <p className="payment-status-text">
              Current Status: <strong className={order.isPaid ? 'paid-text' : 'unpaid-text'}>
                {order.isPaid ? 'PAID' : 'NOT PAID'}
              </strong>
            </p>
          </div>
        </div>
      </div>

      <div className="order-detail-content">
        {/* Order Items */}
        <div className="order-section">
          <h2><FaBox /> Order Items</h2>
          <div className="order-items-list">
            {order.orderItems.map((item, index) => (
              <div key={index} className="order-detail-item">
                <img
                  src={item.image || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: Rs {item.price.toFixed(2)} each</p>
                </div>
                <div className="item-total">
                  Rs {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="order-section">
          <h2><FaMapMarkerAlt /> Shipping Address</h2>
          <div className="info-box">
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="order-section">
          <h2><FaCreditCard /> Payment Information</h2>
          <div className="info-box">
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Payment Status:</strong>{' '}
              <span className={order.isPaid ? 'paid' : 'unpaid'}>
                {order.isPaid ? 'Paid' : 'Not Paid'}
              </span>
            </p>
            {order.isPaid && order.paidAt && (
              <p><strong>Paid At:</strong> {formatDate(order.paidAt)}</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-section">
          <h2>Order Summary</h2>
          <div className="order-summary">
            <div className="summary-row">
              <span>Items Price:</span>
              <span>Rs {order.itemsPrice?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Rs {order.shippingPrice?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>Rs {order.taxPrice?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>Rs {order.totalPrice?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;