import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productAPI.getById(id);
        setProduct(res.data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setAdding(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const renderStars = (rating) => {
    const r = parseFloat(rating) || 0;
    return '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(r));
  };

  if (loading) return <div className="loading-container" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  if (error || !product) return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <div className="empty-state-icon">❌</div>
      <h3>{error || 'Product not found'}</h3>
      <button className="btn-primary-custom" onClick={() => navigate('/products')} style={{ marginTop: '1rem' }}>
        Back to Products
      </button>
    </div>
  );

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('/')}>Home</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-link" onClick={() => navigate('/products')}>Products</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-img-section">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
              alt={product.name}
              className="product-detail-img"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'; }}
            />
          </div>

          {/* Info */}
          <div className="product-detail-info">
            {product.categoryName && (
              <span className="badge-primary">{product.categoryName}</span>
            )}
            <h1 className="product-detail-name">{product.name}</h1>

            {/* Rating */}
            <div className="product-detail-rating">
              <span className="stars">{renderStars(product.rating)}</span>
              <span className="rating-val">{parseFloat(product.rating || 0).toFixed(1)}</span>
              {product.reviewCount > 0 && (
                <span className="review-count-text">({product.reviewCount} reviews)</span>
              )}
            </div>

            {/* Price */}
            <div className="product-detail-price">{formatPrice(product.price)}</div>

            {/* Description */}
            <p className="product-detail-description">{product.description}</p>

            {/* Stock */}
            <div className="product-detail-stock">
              {product.stockQuantity > 10 ? (
                <span className="badge-success">✓ In Stock</span>
              ) : product.stockQuantity > 0 ? (
                <span className="badge-warning">⚠ Only {product.stockQuantity} left</span>
              ) : (
                <span className="badge-danger">✕ Out of Stock</span>
              )}
            </div>

            {/* Quantity */}
            {product.stockQuantity > 0 && (
              <div className="product-detail-quantity">
                <label className="form-label">Quantity</label>
                <div className="quantity-control">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    id="qty-decrease-btn"
                  >−</button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                    disabled={quantity >= product.stockQuantity}
                    id="qty-increase-btn"
                  >+</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="product-detail-actions">
              <button
                className="btn-primary-custom product-detail-add-btn"
                onClick={handleAddToCart}
                disabled={adding || product.stockQuantity === 0}
                id="detail-add-to-cart-btn"
              >
                {adding ? '⏳ Adding...' : added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <button
                className="btn-secondary-custom"
                onClick={() => navigate('/cart')}
                id="go-to-cart-btn"
              >
                View Cart
              </button>
            </div>

            {/* Features */}
            <div className="product-detail-features">
              <div className="feature-item">🚚 Free delivery on orders above ₹499</div>
              <div className="feature-item">🔄 30-day easy returns</div>
              <div className="feature-item">🔒 Secure checkout</div>
              <div className="feature-item">📦 Packed with care</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
