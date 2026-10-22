import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../api/api';
import ProductCard from '../components/ProductCard';

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Wireless Noise-Cancelling Headphones', price: 2999, rating: 4.5, reviewCount: 128, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', categoryName: 'Electronics', stockQuantity: 50 },
  { id: 2, name: 'Smart Watch Series 5', price: 4999, rating: 4.3, reviewCount: 89, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', categoryName: 'Electronics', stockQuantity: 30 },
  { id: 3, name: 'Portable Bluetooth Speaker', price: 1499, rating: 4.4, reviewCount: 201, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', categoryName: 'Electronics', stockQuantity: 75 },
  { id: 4, name: "Men's Slim Fit Jeans", price: 999, rating: 4.2, reviewCount: 345, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', categoryName: 'Fashion', stockQuantity: 100 },
  { id: 5, name: "Women's Floral Summer Dress", price: 799, rating: 4.4, reviewCount: 178, imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', categoryName: 'Fashion', stockQuantity: 80 },
  { id: 6, name: 'Leather Sneakers', price: 2499, rating: 4.5, reviewCount: 256, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', categoryName: 'Fashion', stockQuantity: 45 },
  { id: 7, name: 'Electric Coffee Maker', price: 1999, rating: 4.6, reviewCount: 134, imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', categoryName: 'Home & Kitchen', stockQuantity: 40 },
  { id: 8, name: 'Yoga Mat Premium', price: 599, rating: 4.5, reviewCount: 289, imageUrl: 'https://images.unsplash.com/photo-1601925228073-1d8deaeb6d54?w=400', categoryName: 'Sports', stockQuantity: 120 },
];

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { id: 2, name: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400' },
  { id: 3, name: 'Home & Kitchen', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
  { id: 4, name: 'Books', imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400' },
  { id: 5, name: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400' },
  { id: 6, name: 'Beauty', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getAll({ size: 8 }),
          categoryAPI.getAll(),
        ]);
        const productsData = productsRes.data?.content || productsRes.data || [];
        setProducts(productsData.length > 0 ? productsData : FALLBACK_PRODUCTS);
        const categoriesData = categoriesRes.data || [];
        setCategories(categoriesData.length > 0 ? categoriesData : FALLBACK_CATEGORIES);

        try {
          const newArrivalsRes = await productAPI.getNewArrivals();
          setNewArrivals(newArrivalsRes.data?.slice(0, 4) || []);
        } catch (_) {
          setNewArrivals(FALLBACK_PRODUCTS.slice(0, 4));
        }
      } catch (err) {
        setProducts(FALLBACK_PRODUCTS);
        setCategories(FALLBACK_CATEGORIES);
        setNewArrivals(FALLBACK_PRODUCTS.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="home-page">
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge fade-in-up">✨ New Season Arrivals</div>
          <h1 className="hero-title fade-in-up">
            Shop Smarter,<br />
            <span className="hero-title-accent">Live Better</span>
          </h1>
          <p className="hero-subtitle fade-in-up">
            Discover thousands of premium products across electronics, fashion,
            home & lifestyle — all curated just for you.
          </p>

          {/* Hero Search */}
          <form className="hero-search-form fade-in-up" onSubmit={handleSearch} id="hero-search-form">
            <div className="hero-search-wrapper">
              <span className="hero-search-icon">🔍</span>
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search for products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="hero-search-input"
              />
              <button type="submit" className="hero-search-btn" id="hero-search-btn">
                Search
              </button>
            </div>
          </form>

          <div className="hero-stats fade-in-up">
            <div className="hero-stat">
              <span className="hero-stat-value">10K+</span>
              <span className="hero-stat-label">Products</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">50K+</span>
              <span className="hero-stat-label">Happy Customers</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">4.8★</span>
              <span className="hero-stat-label">Avg Rating</span>
            </div>
          </div>

          <div className="hero-actions fade-in-up">
            <button
              className="btn-primary-custom hero-cta"
              onClick={() => navigate('/products')}
              id="hero-shop-now-btn"
            >
              🛍️ Shop Now
            </button>
            <button
              className="btn-secondary-custom hero-cta"
              onClick={() => document.getElementById('categories-section').scrollIntoView({ behavior: 'smooth' })}
              id="hero-browse-categories-btn"
            >
              Browse Categories
            </button>
          </div>
        </div>

        {/* Floating Product Preview Cards */}
        <div className="hero-float-cards">
          {FALLBACK_PRODUCTS.slice(0, 3).map((p, i) => (
            <div key={p.id} className={`hero-float-card hero-float-card-${i + 1}`}>
              <img src={p.imageUrl} alt={p.name} />
              <div className="hero-float-info">
                <span className="hero-float-name">{p.name.split(' ').slice(0, 3).join(' ')}</span>
                <span className="hero-float-price">₹{p.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────── */}
      <section className="trust-strip">
        <div className="trust-strip-container">
          <div className="trust-item">
            <span className="trust-icon">🚚</span>
            <div>
              <div className="trust-title">Free Delivery</div>
              <div className="trust-sub">On orders above ₹499</div>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🔄</span>
            <div>
              <div className="trust-title">Easy Returns</div>
              <div className="trust-sub">30-day return policy</div>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🔒</span>
            <div>
              <div className="trust-title">Secure Payment</div>
              <div className="trust-sub">100% safe transactions</div>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🎧</span>
            <div>
              <div className="trust-title">24/7 Support</div>
              <div className="trust-sub">Expert help anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────── */}
      <section className="home-section" id="categories-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Explore our curated collections</p>
            </div>
            <button className="btn-secondary-custom" onClick={() => navigate('/products')} id="view-all-categories-btn">
              View All →
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="category-card"
                  onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                  id={`category-card-${cat.id}`}
                >
                  <div className="category-card-img-wrapper">
                    <img
                      src={cat.imageUrl || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'}
                      alt={cat.name}
                      className="category-card-img"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400';
                      }}
                    />
                    <div className="category-card-overlay" />
                  </div>
                  <div className="category-card-body">
                    <h3 className="category-card-name">{cat.name}</h3>
                    <span className="category-card-link">Explore →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────────────── */}
      <section className="home-section home-section-alt">
        <div className="section-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Handpicked for you</p>
            </div>
            <button className="btn-secondary-custom" onClick={() => navigate('/products')} id="view-all-featured-btn">
              View All →
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
            </div>
          ) : (
            <div className="product-grid">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="home-section">
          <div className="section-container">
            <div className="section-header">
              <div>
                <h2 className="section-title">✨ New Arrivals</h2>
                <p className="section-subtitle">Fresh drops this week</p>
              </div>
              <button className="btn-secondary-custom" onClick={() => navigate('/products')} id="view-all-arrivals-btn">
                View All →
              </button>
            </div>
            <div className="product-grid">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROMO BANNER ─────────────────────────────────────── */}
      <section className="promo-banner-section">
        <div className="section-container">
          <div className="promo-banner">
            <div className="promo-banner-content">
              <span className="promo-badge">🔥 Limited Time</span>
              <h2 className="promo-title">Get 20% Off Your First Order!</h2>
              <p className="promo-sub">Use code <strong>CARTNEST20</strong> at checkout. Don't miss out!</p>
              <button
                className="btn-primary-custom promo-btn"
                onClick={() => navigate('/products')}
                id="promo-shop-btn"
              >
                Claim Offer →
              </button>
            </div>
            <div className="promo-banner-decor">
              <div className="promo-circle promo-circle-1" />
              <div className="promo-circle promo-circle-2" />
              <span className="promo-emoji">🎁</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
