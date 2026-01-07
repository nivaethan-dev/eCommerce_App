# Data Management

This folder contains mock data and data utilities for development.

## Files

### mockProducts.js
Mock product data used during development. This file should be **removed or unused** once the backend is integrated.

**Product Schema:**
```javascript
{
  id: number,           // Unique product identifier
  name: string,         // Product name
  price: number,        // Product price
  image: string,        // Product image URL
  description: string,  // Short product description
  category: string      // Product category
}
```

**Available Categories:**
- Electronics
- Fashion
- Home & Garden
- Sports
- Books

## Backend Integration

When integrating with the backend:

1. **Update the API endpoint** in `hooks/useProducts.js`:
   ```javascript
   // Uncomment this line in useProducts.js
   const data = await get('/api/products');
   ```

2. **Remove mock data usage**:
   ```javascript
   // Remove these lines in useProducts.js
   await new Promise(resolve => setTimeout(resolve, 500));
   setProducts(mockProducts);
   ```

3. **Ensure backend returns products in the same schema** as shown above

4. **Optional: Delete or archive** `mockProducts.js` after backend integration is complete

## Expected API Response Format

```javascript
// GET /api/products
[
  {
    "id": 1,
    "name": "Product Name",
    "price": 29.99,
    "image": "https://example.com/image.jpg",
    "description": "Product description",
    "category": "Electronics"
  },
  // ... more products
]
```

The `useProducts` hook will automatically group products by category for display.

