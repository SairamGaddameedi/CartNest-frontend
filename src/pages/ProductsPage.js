import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../api/api';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const currentPage = parseInt(searchParams.get('page') || '0');
  const selectedCategory = searchParams.get('categoryId') || '';
  const keyword = searchParams.get('keyword') || '';
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortDir = searchParams.get('sortDir') || 'asc';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, size: 12, sortBy, sortDir };
      if (selectedCategory) params.categoryId = selectedCategory;
      if (keyword) params.keyword = keyword;
      const res = await productAPI.getAll(params);
      const data = res.data;
      const content = data?.content || data || [];
      setProducts(content);
      setTotalPages(data?.totalPages || 1);
      setTotalElements(data?.totalElements || content.length);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, keyword, sortBy, sortDir]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) params[key] = value; else delete params[key];
    params.page = '0';
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const pageTitle = keyword
    ? `Results for "${keyword}"`
    : selectedCategory
    ? categories.find((c) => String(c.id) === selectedCategory)?.name || 'Products'
    : 'All Products';

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-container">
          <h1>{pageTitle}</h1>
          {totalElements > 0 && (
            <p className="page-header-count">{totalElements} products found</p>
          )}
        </div>
      </div>

      <div className="products-layout">
        {/* ── SIDEBAR FILTERS ── */}
        <aside className="products-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Filters</h3>

            {/* Categories */}
            <div className="sidebar-section">
              <h4 className="sidebar-section-title">Category</h4>
              <div className="category-filter-list">
                <button
                  className={`category-filter-btn ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => updateParam('categoryId', '')}
                  id="category-filter-all"
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`category-filter-btn ${selectedCategory === String(cat.id) ? 'active' : ''}`}
                    onClick={() => updateParam('categoryId', String(cat.id))}
                    id={`category-filter-${cat.id}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="sidebar-section">
              <h4 className="sidebar-section-title">Sort By</h4>
              <select
                className="filter-select"
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [sb, sd] = e.target.value.split('-');
                  const params = Object.fromEntries(searchParams.entries());
                  params.sortBy = sb;
                  params.sortDir = sd;
                  params.page = '0';
                  setSearchParams(params);
                }}
                id="sort-select"
              >
                <option value="id-asc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="name-asc">Name A–Z</option>
              </select>
            </div>

            {(selectedCategory || keyword || sortBy !== 'id') && (
              <button className="btn-secondary-custom clear-filters-btn" onClick={clearFilters} id="clear-filters-btn">
                ✕ Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* ── PRODUCTS GRID ── */}
        <main className="products-main">
          {/* Search info */}
          {keyword && (
            <div className="search-info-bar">
              <span>🔍 Showing results for: <strong>"{keyword}"</strong></span>
              <button className="search-clear-btn" onClick={() => updateParam('keyword', '')} id="clear-search-btn">
                ✕ Clear
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="btn-primary-custom" onClick={clearFilters} id="empty-state-clear-btn" style={{ marginTop: '1rem' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-bar">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 0}
                    onClick={() => updateParam('page', String(currentPage - 1))}
                    id="prev-page-btn"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                    <button
                      key={i}
                      className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                      onClick={() => updateParam('page', String(i))}
                      id={`page-btn-${i}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="pagination-btn"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => updateParam('page', String(currentPage + 1))}
                    id="next-page-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
