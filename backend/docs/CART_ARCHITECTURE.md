# 🏗️ Cart System Architecture

## System Overview

The Cart API follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                        │
│  React/Vue/Angular Application                              │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP Requests (REST API)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXPRESS ROUTER                              │
│  /api/customers/cart/*                                      │
│  - Authentication Middleware                                │
│  - Rate Limiting                                            │
└─────────────────────┬───────────────────────────────────────┘
                      │ Route to Controllers
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                CONTROLLER LAYER                             │
│  customerController.js                                      │
│  - HTTP Request/Response Handling                           │
│  - Input Validation                                         │
│  - Error Formatting                                         │
└─────────────────────┬───────────────────────────────────────┘
                      │ Call Service Methods
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 SERVICE LAYER                               │
│  customerService.js                                         │
│  - Business Logic                                           │
│  - Stock Validation                                         │
│  - Cart Operations                                          │
└─────────────────────┬───────────────────────────────────────┘
                      │ Database Operations
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                DATABASE LAYER                               │
│  MongoDB                                                    │
│  - Customer Collection (with cart subdocuments)            │
│  - Product Collection (for validation)                     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Add Item to Cart Flow
```
Client Request
    ↓
POST /api/customers/cart/items
    ↓
Authentication Middleware (JWT)
    ↓
addCartItem Controller
    ↓
Input Validation (productId, quantity)
    ↓
addToCart Service
    ↓
Product Validation (exists, in stock)
    ↓
Cart Logic (add/update quantity)
    ↓
Database Save
    ↓
Response with Updated Cart
```

### 2. Get Cart Flow
```
Client Request
    ↓
GET /api/customers/cart
    ↓
Authentication Middleware (JWT)
    ↓
getCart Controller
    ↓
getCart Service
    ↓
Database Query with Population
    ↓
Data Cleanup (remove invalid products)
    ↓
Response with Cart + Product Details
```

## Component Details

### 1. Router Layer (`customerRoutes.js`)
```javascript
// RESTful route definitions
router.get('/cart', authMiddleware, getCart);
router.post('/cart/items', authMiddleware, addCartItem);
router.put('/cart/items/:productId', authMiddleware, updateCartItem);
router.delete('/cart/items/:productId', authMiddleware, removeCartItem);
```

**Responsibilities:**
- Route mapping
- Middleware application
- HTTP method handling

### 2. Controller Layer (`customerController.js`)
```javascript
// Example: addCartItem controller
export const addCartItem = async (req, res) => {
  try {
    // 1. Extract data from request
    const { productId, quantity } = req.body;
    
    // 2. Validate input
    if (!productId) return res.status(400).json({...});
    
    // 3. Call service
    const cart = await addToCartService(req.user.id, productId, quantity);
    
    // 4. Send response
    res.status(201).json({ success: true, cart });
  } catch (err) {
    // 5. Handle errors
    res.status(500).json({ success: false, error: err.message });
  }
};
```

**Responsibilities:**
- HTTP request/response handling
- Input validation
- Error formatting
- Status code management

### 3. Service Layer (`customerService.js`)
```javascript
// Example: addToCart service
export const addToCart = async (customerId, productId, quantity) => {
  // 1. Find customer
  const customer = await Customer.findById(customerId);
  
  // 2. Validate product
  const product = await Product.findById(productId);
  
  // 3. Check stock
  if (product.stock <= 0) throw new Error('Out of stock');
  
  // 4. Update cart
  const index = customer.cart.findIndex(item => ...);
  if (index > -1) {
    // Update existing item
  } else {
    // Add new item
  }
  
  // 5. Save and return
  await customer.save();
  return customer.cart;
};
```

**Responsibilities:**
- Business logic implementation
- Database operations
- Data validation
- Error handling

### 4. Database Layer (MongoDB)

#### Customer Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  cart: [
    {
      productId: ObjectId,  // Reference to Product
      quantity: Number,
      addedAt: Date
    }
  ]
}
```

#### Product Collection
```javascript
{
  _id: ObjectId,
  title: String,
  price: Number,
  stock: Number,
  category: String
}
```

## Security Architecture

### 1. Authentication Flow
```
Client Login
    ↓
JWT Token Generation
    ↓
Token Storage (Client)
    ↓
Token in Request Headers
    ↓
Middleware Validation
    ↓
User Context (req.user)
```

### 2. Authorization
- All cart operations require valid JWT
- User can only access their own cart
- No cross-user cart access

### 3. Input Validation
- Product ID format validation
- Quantity range validation
- Required field validation

## Error Handling Strategy

### 1. Error Types
```
Client Errors (4xx)
├── Validation Errors (400)
├── Authentication Errors (401)
└── Not Found Errors (404)

Server Errors (5xx)
├── Database Errors (500)
├── Service Errors (500)
└── Unexpected Errors (500)
```

### 2. Error Propagation
```
Service Layer
    ↓ (throws Error)
Controller Layer
    ↓ (catches & formats)
HTTP Response
    ↓ (status + message)
Client
```

## Performance Considerations

### 1. Database Optimization
- Indexes on frequently queried fields
- Efficient population of related data
- Minimal database queries per operation

### 2. Caching Strategy
- Cart data cached in memory
- Product data could be cached
- JWT token validation caching

### 3. Concurrency Handling
- Database transactions for critical operations
- Optimistic locking for cart updates
- Race condition prevention

## Scalability Patterns

### 1. Horizontal Scaling
- Stateless service design
- Load balancer ready
- Database connection pooling

### 2. Microservices Ready
- Clear service boundaries
- Independent deployment
- API-first design

### 3. Monitoring & Logging
- Request/response logging
- Error tracking
- Performance metrics

## Development Workflow

### 1. Local Development
```
1. Start MongoDB
2. Start Express server
3. Test with Postman/curl
4. Frontend integration
```

### 2. Testing Strategy
```
Unit Tests
├── Service layer tests
├── Controller tests
└── Model tests

Integration Tests
├── API endpoint tests
├── Database integration
└── Authentication tests
```

### 3. Deployment
```
Development
    ↓
Testing
    ↓
Staging
    ↓
Production
```

## Best Practices Implemented

### 1. REST API Design
- Resource-based URLs
- Proper HTTP methods
- Consistent response format
- Meaningful status codes

### 2. Code Organization
- Separation of concerns
- Single responsibility principle
- DRY (Don't Repeat Yourself)
- Clear naming conventions

### 3. Error Handling
- Comprehensive error coverage
- User-friendly error messages
- Proper HTTP status codes
- Logging for debugging

### 4. Security
- JWT authentication
- Input validation
- SQL injection prevention
- XSS protection

This architecture provides a solid foundation for a scalable, maintainable cart system that can grow with your e-commerce application.
