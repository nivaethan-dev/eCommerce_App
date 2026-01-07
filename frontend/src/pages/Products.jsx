import './Products.css';

const Products = () => {
  return (
    <div className="products">
      <div className="products-container">
        <h1 className="products-title">Products</h1>
        <p className="products-subtitle">
          Welcome to the Products Page
        </p>
        
        <div className="products-content">
          {/* Placeholder content - can be expanded with about us features later */}
          <div className="products-card">
            <h2>Products Overview</h2>
            <p>This is the Products page. Add your content here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

