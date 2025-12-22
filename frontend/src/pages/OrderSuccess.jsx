import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div className="order-success-container">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. Your order has been received and is being processed.</p>
        
        <div className="order-info">
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Payment Method:</strong> Cash on Delivery</p>
          <p className="delivery-note">You will receive your order within 3-5 business days.</p>
        </div>

        <div className="action-buttons">
          <Link to="/orders" className="view-orders-btn">
            View My Orders
          </Link>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;