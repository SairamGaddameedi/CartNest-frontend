import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('CartNest Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', background: '#0a0a0f',
          color: '#e8e8f0', fontFamily: 'Inter, sans-serif', padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ marginBottom: '1rem', color: '#ff4757' }}>Something went wrong</h2>
          <p style={{ color: '#9090b0', marginBottom: '2rem', maxWidth: '500px' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
            style={{
              background: 'linear-gradient(135deg, #6c47ff, #5235cc)',
              color: 'white', border: 'none', padding: '0.75rem 2rem',
              borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600
            }}
          >
            🏠 Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Catch-all */}
            <Route path="*" element={
              <div className="empty-state" style={{ minHeight: '60vh' }}>
                <div className="empty-state-icon">🔍</div>
                <h3>Page Not Found</h3>
                <a href="/" className="btn-primary-custom" style={{ marginTop: '1rem', textDecoration: 'none' }}>Go Home</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
