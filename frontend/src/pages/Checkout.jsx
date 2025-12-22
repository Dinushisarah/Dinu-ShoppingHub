import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      alert('Please login to checkout');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // DON'T redirect if cart is empty - let the order complete first!
  // Removed the problematic useEffect

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };


  const calculateTotals = () => {
    const subtotal = getCartTotal();
    const shipping = 500;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.phone) {
      setError('Please fill in all shipping information');
      setLoading(false);
      return;
    }

    try {
      const totals = calculateTotals();
      
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || 'https://via.placeholder.com/150',
        })),
        shippingAddress: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          country: 'Sri Lanka',
          phone: shippingInfo.phone,
        },
        paymentMethod: 'Cash on Delivery',
        itemsPrice: totals.subtotal,
        taxPrice: totals.tax,
        shippingPrice: totals.shipping,
        totalPrice: totals.total,
      };

      const response = await axios.post('/orders', orderData);
      clearCart();
      navigate(`/order-success/${response.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <div className="shipping-section">
          <h2>Shipping Information</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handlePlaceOrder} className="shipping-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleChange}
                placeholder="Street address"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code *</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleChange}
                placeholder="07X XXX XXXX"
                required
              />
            </div>
            <div className="payment-method">
              <h3>Payment Method</h3>
              <div className="payment-option">
                <input type="radio" id="cod" name="payment" value="cod" defaultChecked />
                <label htmlFor="cod">Cash on Delivery</label>
              </div>
            </div>
            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item._id} className="checkout-item">
                <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-price">Rs {(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>Rs {subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>Rs {shipping.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax (10%):</span>
              <span>Rs {tax.toFixed(2)}</span>
            </div>
            <div className="total-divider"></div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>Rs {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;