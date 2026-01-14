import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CategoryFilterBar from '../components/products/CategoryFilterBar';
import ProductGrid from '../components/products/ProductGrid';
import { useProductCategories } from '../hooks/useProductCategories';
import { useCategoryProducts } from '../hooks/useCategoryProducts';
import './CategoryProducts.css';

const CategoryProducts = () => {
  const params = useParams();
  const navigate = useNavigate();

  const category = useMemo(() => {
    const raw = params?.category || '';
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [params?.category]);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useProductCategories();

  const {
    products,
    loading,
    error,
    hasMore,
    loadingMore,
    loadMore,
  } = useCategoryProducts({ category, pageSize: 12 });

  const onCategoryChange = (nextCategory) => {
    navigate(`/products/category/${encodeURIComponent(nextCategory)}`);
  };

  // If user lands on an invalid category URL, redirect to first valid category.
  useEffect(() => {
    if (categoriesLoading) return;
    if (!categories || categories.length === 0) return;
    if (category && categories.includes(category)) return;
    navigate(`/products/category/${encodeURIComponent(categories[0])}`, { replace: true });
  }, [categories, categoriesLoading, category, navigate]);

  return (
    <div className="category-products">
      <div className="category-products-container">
        <div className="category-products-topbar">
          <Link className="category-products-back" to="/products">
            ← Back to Products
          </Link>
        </div>

        <h1 className="category-products-title">{category || 'Category'}</h1>
        <p className="category-products-subtitle">
          Browse all items in {category || 'this category'}
        </p>

        {categoriesError && (
          <div className="category-products-hint">
            Could not load category list: {categoriesError}
          </div>
        )}

        {categories.length > 0 && (
          <CategoryFilterBar
            categories={categories}
            value={categories.includes(category) ? category : categories[0]}
            onChange={onCategoryChange}
            disabled={categoriesLoading}
            label="Switch category"
          />
        )}

        {loading && (
          <div className="category-products-loading">Loading products...</div>
        )}

        {error && (
          <div className="category-products-error">
            <p>Error loading products: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <ProductGrid products={products} />

            {products.length === 0 && (
              <div className="category-products-empty">
                No products available in this category.
              </div>
            )}

            {hasMore && products.length > 0 && (
              <div className="category-products-loadmore">
                <button onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;


