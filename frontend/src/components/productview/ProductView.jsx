import React, { useState } from "react";
import "./ProductView.css";

const ProductView = () => {
 
  const [quantity, setQuantity] = useState(1);


  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) setQuantity(value);
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} item(s) to cart`);
    
  };


  const handleBuyNow = () => {
    console.log(`Buying ${quantity} item(s) now`);
    
  };

  return (
    <div className="product-page">
      
      <div className="product-image-section">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN68Bmc2dd7ssQqqzmKnaklDv_IT5yTHE37g&s"
          alt="Cooling Fan"
          className="product-image"
        />
      </div>

      <div className="product-details">
        <h2>Cooling Fan</h2>

        <p className="product-title">
          High-speed cooling fan ensures efficient airflow, quiet operation, and
          heat control.
        </p>

        <h1 className="price">US $37.98</h1>

        <div className="quantity-row">
          <span>Quantity:</span>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>

        <div className="button-row">
          <button className="buy-btn" onClick={handleBuyNow}>
            Buy It Now
          </button>
          <button className="cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductView;

