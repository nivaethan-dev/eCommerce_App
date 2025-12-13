import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  
  const categories = [
    { id: 1, name: 'Electronics', icon: '💻', color: '#667eea', slug: 'electronics' },
    { id: 2, name: 'Fashion', icon: '👗', color: '#f093fb', slug: 'fashion' },
    { id: 3, name: 'Home & Garden', icon: '🏡', color: '#4facfe', slug: 'home-garden' },
    { id: 4, name: 'Sports', icon: '⚽', color: '#43e97b', slug: 'sports' },
    { id: 5, name: 'Books', icon: '📚', color: '#fa709a', slug: 'books' },
    { id: 6, name: 'Toys', icon: '🎮', color: '#feca57', slug: 'toys' },
    { id: 7, name: 'Beauty', icon: '💄', color: '#ff6b6b', slug: 'beauty' },
    { id: 8, name: 'Food & Beverage', icon: '🍔', color: '#ee5a6f', slug: 'food-beverage' }
  ];

  const handleCategoryClick = (slug) => {
    // Navigate to products page with category filter
    navigate(`/products?category=${slug}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to CloudCart</h1>
          <p className="hero-subtitle">
            Discover amazing products at unbeatable prices
          </p>
          <button className="hero-cta" onClick={() => navigate('/products')}>
            Shop Now
          </button>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Categories Showcase */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div 
                  className="category-image"
                  style={{ background: `linear-gradient(135deg, ${category.color}22 0%, ${category.color}44 100%)` }}
                >
                  <span className="category-icon">{category.icon}</span>
                </div>
                <h3 className="category-name">{category.name}</h3>
                <button 
                  className="category-btn"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  Browse
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;


