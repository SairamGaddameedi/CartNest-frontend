import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../api/api';

const CartPage = () => {
  const { cart, updateItem, removeItem, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    shippingAddress: '', city: '', state: '', pincode: '', phone: ''
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) {
      await removeItem(itemId);
    } else {
      await updateItem(itemId, newQty);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!checkoutForm.shippingAddress || !checkoutForm.city || !checkoutForm.pincode || !checkoutForm.phone) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      setCheckingOut(true);
      await orderAPI.checkout({
        shippingAddress: `${checkoutForm.shippingAddress}, ${checkoutForm.city}, ${checkoutForm.state} - ${checkoutForm.pincode}`,
        phone: checkoutForm.phone,
      });
      await clearCart();
      setOrderPlaced(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="auth-page">
        <div className="form-card" style={{ textAlign: 'center', maxWidth: 500 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 className="form-title">Order Placed!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Thank you for shopping at CartNest! Your order has been confirmed and will be delivered soon.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary-custom" onClick={() => navigate('/orders')} id="view-orders-btn">
              📦 View Orders
            </button>
            <button className="btn-secondary-custom" onClick={() => navigate('/')} id="continue-shopping-btn">
              🛍️ Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="auth-page">
        <div className="form-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</div>
          <h2 className="form-title">Your Cart</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Please sign in to view your cart and checkout.
          </p>
          <button className="btn-primary-custom" onClick={() => navigate('/login')} id="cart-login-btn">
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;
  const deliveryFee = totalPrice > 499 ? 0 : 49;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <div className="cart-page">
      <div className="page-header">
        <div className="page-header-container">
          <h1>🛍️ My Cart</h1>
          {items.length > 0 && <p className="page-header-count">{items.length} item{items.length !== 1 ? 's' : ''}</p>}
        </div>
      </div>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items-section">
          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Discover amazing products and add them to your cart</p>
              <button className="btn-primary-custom" onClick={() => navigate('/products')} style={{ marginTop: '1rem' }} id="cart-empty-shop-btn">
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="cart-item" id={`cart-item-${item.id}`}>
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                    alt={item.productName}
                    className="cart-item-img"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'; }}
                  />
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.productName}</h4>
                    <p className="cart-item-price">{formatPrice(item.price)}</p>
                  </div>
                  <div className="quantity-control">
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} id={`qty-dec-${item.id}`}>−</button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} id={`qty-inc-${item.id}`}>+</button>
                  </div>
                  <div className="cart-item-subtotal">{formatPrice(item.price * item.quantity)}</div>
                  <button className="btn-danger-custom" onClick={() => removeItem(item.id)} id={`remove-${item.id}`}>🗑</button>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <button className="btn-secondary-custom" onClick={() => navigate('/products')} id="continue-shopping-link">
                  ← Continue Shopping
                </button>
                <button className="btn-danger-custom" onClick={clearCart} id="clear-cart-btn">
                  🗑 Clear Cart
                </button>
              </div>
            </>
          )}
        </div>

        {/* Order Summary */}
        {items.length > 0 && (
          <div className="order-summary">
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({items.length} items)</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : formatPrice(deliveryFee)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="summary-note">Add ₹{499 - totalPrice} more for free delivery</div>
            )}
            <div className="divider" />
            <div className="summary-row summary-total">
              <span>Grand Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            {!showCheckout ? (
              <button
                className="btn-primary-custom checkout-btn"
                onClick={() => setShowCheckout(true)}
                id="proceed-checkout-btn"
              >
                Proceed to Checkout →
              </button>
            ) : (
              <form onSubmit={handleCheckout} style={{ marginTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Shipping Details</h4>
                <div className="form-group">
                  <label className="form-label">Address *</label>
                  <input className="form-input" placeholder="Street address" value={checkoutForm.shippingAddress}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, shippingAddress: e.target.value })} id="checkout-address" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-input" placeholder="City" value={checkoutForm.city}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })} id="checkout-city" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" placeholder="State" value={checkoutForm.state}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, state: e.target.value })} id="checkout-state" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">PIN Code *</label>
                    <input className="form-input" placeholder="560001" value={checkoutForm.pincode}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, pincode: e.target.value })} id="checkout-pincode" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input className="form-input" placeholder="9876543210" value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} id="checkout-phone" />
                  </div>
                </div>
                <button type="submit" className="btn-primary-custom checkout-btn" disabled={checkingOut} id="place-order-btn">
                  {checkingOut ? '⏳ Placing Order...' : '✅ Place Order'}
                </button>
              </form>
            )}

            <div className="cart-trust">
              <span>🔒 Secure Checkout</span>
              <span>🚚 Fast Delivery</span>
              <span>🔄 Easy Returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
