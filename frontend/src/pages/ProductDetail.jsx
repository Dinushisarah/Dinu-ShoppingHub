import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaArrowLeft, FaBox, FaTruck } from 'react-icons/fa';
import { useCart } from '../context/cart';
import axios from '../api/axios';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/products/${id}`);
      setProduct(response.data.product || response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Product Not Found</h2>
        <p>{error}</p>
        <Link to="/" className="back-home-btn">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Link to="/" className="back-link">
        <FaArrowLeft /> Back to Products
      </Link>

      <div className="product-detail-content">
        <div className="product-image-section">
          <div className="main-image">
            <img
              src={product.image || 'https://via.placeholder.com/500'}
              alt={product.name}
            />
            {product.stock === 0 && (
              <div className="out-of-stock-overlay">
                <span>OUT OF STOCK</span>
              </div>
            )}
          </div>
        </div>

        <div className="product-info-section">
          <span className="product-category">{product.category}</span>
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < Math.floor(product.rating || 0) ? 'star-filled' : 'star-empty'}
                />
              ))}
            </div>
            <span className="rating-text">
              {product.rating ? product.rating.toFixed(1) : '0.0'} / 5.0
            </span>
          </div>

          <div className="product-price-section">
            <span className="current-price">Rs {product.price.toFixed(2)}</span>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || 'No description available for this product.'}</p>
          </div>

          <div className="product-stock-info">
            <div className="stock-item">
              <FaBox />
              <span>
                {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
              </span>
            </div>
            <div className="stock-item">
              <FaTruck />
              <span>Free shipping on orders over Rs 10,000</span>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="product-actions">
            {product.stock > 0 ? (
              <>
                <button onClick={handleAddToCart} className="add-to-cart-btn">
                  <FaShoppingCart /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="buy-now-btn">
                  Buy Now
                </button>
              </>
            ) : (
              <button className="out-of-stock-btn" disabled>
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="additional-info">
        <div className="info-section">
          <h3>Product Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">{product.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Stock:</span>
              <span className="info-value">{product.stock} units</span>
            </div>
            <div className="info-item">
              <span className="info-label">Rating:</span>
              <span className="info-value">{product.rating || 0} / 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;