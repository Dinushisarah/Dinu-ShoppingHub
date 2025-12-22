import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './AdminProducts.css';

const AdminProducts = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    image: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/products');
      setProducts(response.data.products || []);
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: product.image,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        stock: '',
        image: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      stock: '',
      image: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingProduct) {
        // Update product
        const response = await axios.put(`/admin/products/${editingProduct._id}`, formData);
        setProducts(products.map(p => p._id === editingProduct._id ? response.data.product : p));
        alert('Product updated successfully!');
      } else {
        // Create product
        const response = await axios.post('/admin/products', formData);
        setProducts([response.data.product, ...products]);
        alert('Product created successfully!');
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeleteLoading(productId);
      await axios.delete(`/admin/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      alert('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-products-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="admin-products-container">
      <div className="admin-products-header">
        <Link to="/admin" className="back-link">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <div className="header-content">
          <div>
            <h1>Products Management</h1>
            <p>Manage your store products</p>
          </div>
          <button onClick={() => handleOpenModal()} className="add-product-btn">
            <FaPlus /> Add New Product
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchProducts}>Retry</button>
        </div>
      )}

      <div className="products-stats">
        <div className="stat-box">
          <h3>Total Products</h3>
          <p className="stat-number">{products.length}</p>
        </div>
        <div className="stat-box">
          <h3>In Stock</h3>
          <p className="stat-number in-stock">
            {products.filter(p => p.stock > 0).length}
          </p>
        </div>
        <div className="stat-box">
          <h3>Out of Stock</h3>
          <p className="stat-number out-of-stock">
            {products.filter(p => p.stock === 0).length}
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <h2>No Products Yet</h2>
          <p>Click "Add New Product" to create your first product.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card-admin">
              <div className="product-image-container">
                <img
                  src={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="product-image"
                />
                <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                </span>
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">
                  {product.description?.substring(0, 100)}...
                </p>
                <p className="product-price">Rs {product.price.toFixed(2)}</p>
              </div>
              <div className="product-actions">
                <button
                  onClick={() => handleOpenModal(product)}
                  className="action-btn edit-btn"
                  title="Edit Product"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="action-btn delete-btn"
                  disabled={deleteLoading === product._id}
                  title="Delete Product"
                >
                  {deleteLoading === product._id ? '...' : <><FaTrash /> Delete</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={handleCloseModal} className="close-btn">×</button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (Rs) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Phones">Phones</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;