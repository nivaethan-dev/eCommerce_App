import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  
  const categories = [
    { id: 1, name: 'Electronics', image: 'https://res.cloudinary.com/dqaqkdgjs/image/upload/v1768237765/cloudcart/products/product_fa4267bfb4c4ecf9ea891408c8388bec.jpg', color: '#667eea' },
    { id: 2, name: 'Clothing', image: 'https://res.cloudinary.com/dqaqkdgjs/image/upload/v1768141728/cloudcart/products/product_6901e92c314336883328b918.jpg', color: '#f093fb' },
    { id: 3, name: 'Home & Kitchen', image: 'https://res.cloudinary.com/dqaqkdgjs/image/upload/v1768921049/cloudcart/products/product_8f6a43b32e3185945c07cd698b1c6028.jpg', color: '#4facfe' },
    { id: 4, name: 'Sports', image: 'https://res.cloudinary.com/dqaqkdgjs/image/upload/v1768415252/cloudcart/products/product_fa3936f331873532c2283b5246c156d5.jpg', color: '#43e97b' },
    { id: 5, name: 'Books', image: 'https://res.cloudinary.com/dqaqkdgjs/image/upload/v1768414631/cloudcart/products/product_bbdc54a02490de74a0b2b4bda2f1b563.jpg', color: '#fa709a' }
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


