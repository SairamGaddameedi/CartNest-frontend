import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    orderAPI.getMyOrders()
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const statusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'badge-warning';
      case 'CONFIRMED': return 'badge-primary';
      case 'SHIPPED': return 'badge-primary';
      case 'DELIVERED': return 'badge-success';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <div className="page-header-container">
          <h1>📦 My Orders</h1>
        </div>
      </div>

      <div className="orders-container">
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
            <button className="btn-primary-custom" onClick={() => navigate('/products')} style={{ marginTop: '1rem' }} id="orders-empty-shop-btn">
              Shop Now
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card" id={`order-card-${order.id}`}>
              <div className="order-card-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className={statusColor(order.status)} style={{ marginLeft: '0.75rem' }}>
                    {order.status}
                  </span>
                </div>
                <div className="order-date">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  }) : 'N/A'}
                </div>
              </div>

              {order.items && (
                <div className="order-items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <span className="order-item-name">{item.productName}</span>
                      <span className="order-item-qty">×{item.quantity}</span>
                      <span className="order-item-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="order-card-footer">
                <div className="order-address">
                  📍 {order.shippingAddress || 'N/A'}
                </div>
                <div className="order-total">
                  Total: <strong>{formatPrice(order.totalAmount)}</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
