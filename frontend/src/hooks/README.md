# Custom Hooks

This folder contains custom React hooks for data fetching and state management.

## useProducts Hook

### Purpose
Fetches and manages product data from the backend (or mock data during development).

### Usage

```javascript
import { useProducts } from '../hooks/useProducts';

function MyComponent() {
  const { products, productsByCategory, categories, loading, error } = useProducts();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {categories.map(category => (
        <div key={category}>
          <h2>{category}</h2>
          {productsByCategory[category].map(product => (
            <div key={product.id}>{product.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Return Values

- **products** `Array` - Flat array of all products
- **productsByCategory** `Object` - Products grouped by category
  ```javascript
  {
    "Electronics": [...products],
    "Fashion": [...products],
    // etc.
  }
  ```
- **categories** `Array` - List of all category names
- **loading** `boolean` - Loading state
- **error** `string|null` - Error message if fetch fails

### Backend Integration

To integrate with your backend API:

1. Open `hooks/useProducts.js`
2. Uncomment the API call:
   ```javascript
   const data = await get('/api/products');
   ```
3. Remove the mock data lines:
   ```javascript
   // DELETE THESE
   await new Promise(resolve => setTimeout(resolve, 500));
   setProducts(mockProducts);
   ```

### API Requirements

Your backend should return an array of products with this structure:

```javascript
[
  {
    id: number,
    name: string,
    price: number,
    image: string,
    description: string,
    category: string
  }
]
```

The hook handles:
- ✅ Loading states
- ✅ Error handling
- ✅ Grouping products by category
- ✅ Automatic re-fetching on component mount

