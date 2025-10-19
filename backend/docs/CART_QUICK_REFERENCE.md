# 🛒 Cart API Quick Reference

## Quick Start

### Base URL
```
/api/customers
```

### Authentication
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

---

## Endpoints Summary

| Method | Endpoint | Purpose | Body |
|--------|----------|---------|------|
| `GET` | `/cart` | Get cart | - |
| `POST` | `/cart/items` | Add item | `{productId, quantity}` |
| `PUT` | `/cart/items/:productId` | Update quantity | `{quantity}` |
| `DELETE` | `/cart/items/:productId` | Remove item | - |

---

## Request Examples

### Get Cart
```bash
curl -X GET /api/customers/cart \
  -H "Authorization: Bearer <token>"
```

### Add Item
```bash
curl -X POST /api/customers/cart/items \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"productId": "507f1f77bcf86cd799439011", "quantity": 2}'
```

### Update Quantity
```bash
curl -X PUT /api/customers/cart/items/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

### Remove Item
```bash
curl -X DELETE /api/customers/cart/items/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>"
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "cart": [...]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Status Codes

- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (auth required)
- `500` - Server Error

---

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Product ID is required` | Missing productId | Include productId in request |
| `Quantity must be at least 1` | Invalid quantity | Use positive integer |
| `Product not found` | Invalid productId | Check product exists |
| `Product is out of stock` | No stock available | Check product stock |
| `Only X items available` | Exceeds stock | Reduce quantity |

---

## JavaScript Examples

### Fetch Cart
```javascript
const response = await fetch('/api/customers/cart', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

### Add to Cart
```javascript
const response = await fetch('/api/customers/cart/items', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    productId: '507f1f77bcf86cd799439011',
    quantity: 2
  })
});
```

### Update Quantity
```javascript
const response = await fetch('/api/customers/cart/items/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    quantity: 3
  })
});
```

### Remove Item
```javascript
const response = await fetch('/api/customers/cart/items/507f1f77bcf86cd799439011', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Testing with Postman

### Collection Setup
1. Create new collection: "E-commerce Cart API"
2. Set base URL: `{{baseUrl}}/api/customers`
3. Add environment variable: `baseUrl = http://localhost:3000`

### Headers for All Requests
```
Authorization: Bearer {{jwt_token}}
Content-Type: application/json
```

### Test Cases
1. **Get Empty Cart** - `GET /cart`
2. **Add Item** - `POST /cart/items` with valid productId
3. **Update Quantity** - `PUT /cart/items/:productId` with new quantity
4. **Remove Item** - `DELETE /cart/items/:productId`
5. **Error Cases** - Test with invalid data

---

## Frontend Integration

### React Hook Example
```javascript
const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const addToCart = async (productId, quantity) => {
    setLoading(true);
    try {
      const response = await fetch('/api/customers/cart/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { cart, addToCart, loading };
};
```

---

## Need More Details?

See the full documentation: [CART_API_DOCUMENTATION.md](./CART_API_DOCUMENTATION.md)
