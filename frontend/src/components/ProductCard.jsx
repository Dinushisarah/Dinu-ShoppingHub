import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cart';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-image-link">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="product-image"
        />
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-description">
          {product.description?.substring(0, 100) || 'No description available'}...
        </p>
        <div className="product-footer">
          <span className="product-price">Rs {product.price.toFixed(2)}</span>
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
