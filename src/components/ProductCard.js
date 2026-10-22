import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAdding(false);
    }
  };

  const renderStars = (rating) => {
    const r = parseFloat(rating) || 0;
    const full = Math.floor(r);
    const half = r - full >= 0.5;
    return (
      <span className="product-card-rating">
        {'★'.repeat(full)}
        {half ? '½' : ''}
        {'☆'.repeat(5 - full - (half ? 1 : 0))}
        <span className="rating-number"> {r.toFixed(1)}</span>
        {product.reviewCount > 0 && (
          <span className="review-count"> ({product.reviewCount})</span>
        )}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product.id}`)}
      id={`product-card-${product.id}`}
    >
      <div className="product-card-img-wrapper">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
          alt={product.name}
          className="product-card-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
          }}
        />
        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <span className="stock-badge low-stock">Only {product.stockQuantity} left!</span>
        )}
        {product.stockQuantity === 0 && (
          <span className="stock-badge out-of-stock">Out of Stock</span>
        )}
        <div className="product-card-overlay">
          <button
            className="btn-primary-custom quick-add-btn"
            onClick={handleAddToCart}
            disabled={adding || product.stockQuantity === 0}
            id={`add-to-cart-${product.id}`}
          >
            {adding ? '⏳ Adding...' : added ? '✅ Added!' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>

      <div className="product-card-body">
        {product.categoryName && (
          <span className="product-card-category">{product.categoryName}</span>
        )}
        <h3 className="product-card-title">{product.name}</h3>
        {renderStars(product.rating)}
        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          <button
            className="btn-primary-custom add-btn-mobile"
            onClick={handleAddToCart}
            disabled={adding || product.stockQuantity === 0}
            id={`add-to-cart-mobile-${product.id}`}
          >
            {adding ? '⏳' : added ? '✅' : '🛒'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
