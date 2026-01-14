import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  
  const categories = [
    { id: 1, name: 'Electronics', image: 'https://picsum.photos/seed/electronics/400/300', color: '#667eea' },
    { id: 2, name: 'Clothing', image: 'https://picsum.photos/seed/fashion/400/300', color: '#f093fb' },
    { id: 3, name: 'Home & Kitchen', image: 'https://picsum.photos/seed/homegarden/400/300', color: '#4facfe' },
    { id: 4, name: 'Sports', image: 'https://picsum.photos/seed/sports/400/300', color: '#43e97b' },
    { id: 5, name: 'Books', image: 'https://picsum.photos/seed/books/400/300', color: '#fa709a' }
  ];

  const handleCategoryClick = (categoryName) => {
    // Navigate to products page with category filter
    navigate(`/products/category/${encodeURIComponent(categoryName)}`);
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
                <div className="category-image">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="category-img"
                    loading="lazy"
                  />
                </div>
                <h3 className="category-name">{category.name}</h3>
                <button 
                  className="category-btn"
                  onClick={() => handleCategoryClick(category.name)}
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


