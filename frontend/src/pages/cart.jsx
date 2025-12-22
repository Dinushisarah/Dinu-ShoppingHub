import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/cart';
import { useAuth } from '../context/AuthContext';
import './cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please login to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <FaShoppingCart className="empty-cart-icon" />
        <h2>Your Cart is Empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button onClick={clearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.image || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="cart-item-image"
              />

              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-category">{item.category}</p>
                <p className="cart-item-price">Rs.{item.price.toFixed(2)}</p>
              </div>

              <div className="cart-item-quantity">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  <FaMinus />
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="quantity-btn"
                  disabled={item.quantity >= item.stock}
                >
                  <FaPlus />
                </button>
              </div>

              <div className="cart-item-total">
                <p>Rs.{(item.price * item.quantity).toFixed(2)}</p>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="remove-item-btn"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>Rs.{getCartTotal().toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping:</span>
            <span>Rs.10.00</span>
          </div>

          <div className="summary-row">
            <span>Tax (10%):</span>
            <span>Rs.{(getCartTotal() * 0.1).toFixed(2)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>Total:</span>
            <span>Rs.{(getCartTotal() + 10 + getCartTotal() * 0.1).toFixed(2)}</span>
          </div>

          <button onClick={handleCheckout} className="checkout-btn">
            Proceed to Checkout
          </button>

          <Link to="/" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;