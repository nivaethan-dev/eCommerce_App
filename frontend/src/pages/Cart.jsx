import './Cart.css';

const Cart = () => {
  return (
    <div className="cart">
      <div className="cart-container">
        <h1 className="cart-title">cart</h1>
        <p className="cart-subtitle">
          Welcome to the cart Page
        </p>
        
        <div className="cart-content">
          {/* Placeholder content - can be expanded with about us features later */}
          <div className="cart-card">
            <h2>cart Overview</h2>
            <p>This is the cart page. Add your content here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

