# 📚 E-commerce Cart API Documentation

Welcome to the comprehensive documentation for the E-commerce Cart API system. This documentation is designed to help developers understand, implement, and maintain the cart functionality.

## 📖 Documentation Structure

### 1. [Cart API Documentation](./CART_API_DOCUMENTATION.md)
**Complete API reference with detailed examples**
- Overview and features
- Authentication requirements
- Complete endpoint documentation
- Request/response examples
- Error handling guide
- Business logic explanation
- Implementation details
- Best practices
- Troubleshooting guide

### 2. [Cart Quick Reference](./CART_QUICK_REFERENCE.md)
**Quick start guide for developers**
- Endpoint summary table
- Common request examples
- JavaScript integration examples
- Postman collection setup
- Frontend integration patterns
- Common error solutions

### 3. [Cart Architecture](./CART_ARCHITECTURE.md)
**System design and architecture overview**
- Layered architecture diagram
- Data flow explanations
- Component responsibilities
- Security architecture
- Performance considerations
- Scalability patterns
- Development workflow

## 🚀 Quick Start

### For New Developers
1. Start with [Cart Quick Reference](./CART_QUICK_REFERENCE.md) for immediate implementation
2. Read [Cart API Documentation](./CART_API_DOCUMENTATION.md) for comprehensive understanding
3. Review [Cart Architecture](./CART_ARCHITECTURE.md) for system design insights

### For Frontend Developers
- Focus on [Cart Quick Reference](./CART_QUICK_REFERENCE.md)
- Use the JavaScript examples for integration
- Reference the error handling section for robust implementation

### For Backend Developers
- Start with [Cart Architecture](./CART_ARCHITECTURE.md)
- Review [Cart API Documentation](./CART_API_DOCUMENTATION.md) for implementation details
- Use the troubleshooting guide for debugging

## 🛒 Cart System Overview

The Cart API provides a complete shopping cart solution with:

- ✅ **RESTful Design** - Proper HTTP methods and resource naming
- ✅ **Stock Validation** - Prevents overselling
- ✅ **Product Validation** - Ensures data integrity
- ✅ **Authentication** - JWT-protected endpoints
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Data Population** - Returns full product details

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cart` | Retrieve customer's cart |
| `POST` | `/cart/items` | Add item to cart |
| `PUT` | `/cart/items/:productId` | Update item quantity |
| `DELETE` | `/cart/items/:productId` | Remove item from cart |

## 📋 Prerequisites

- Node.js and Express.js
- MongoDB database
- JWT authentication
- Basic understanding of REST APIs

## 🔧 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install express mongoose jsonwebtoken bcryptjs
   ```

2. **Environment Variables**
   ```env
   CUSTOMER_JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Import Routes**
   ```javascript
   import customerRoutes from './routes/customerRoutes.js';
   app.use('/api/customers', customerRoutes);
   ```

## 📝 Usage Examples

### Basic Cart Operations

```javascript
// Get cart
const cart = await fetch('/api/customers/cart', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Add item
await fetch('/api/customers/cart/items', {
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

## 🐛 Common Issues

### Authentication Errors
- Ensure JWT token is valid and not expired
- Check Authorization header format: `Bearer <token>`

### Validation Errors
- Verify productId is a valid MongoDB ObjectId
- Ensure quantity is a positive integer
- Check all required fields are provided

### Stock Errors
- Verify product has sufficient stock
- Check if product is still available
- Ensure quantity doesn't exceed available stock

## 📞 Support

For additional help:
1. Check the troubleshooting section in [Cart API Documentation](./CART_API_DOCUMENTATION.md)
2. Review error responses for specific guidance
3. Verify request format matches examples
4. Check authentication and permissions

## 🔄 Version History

- **v1.0.0** - Initial cart implementation with basic CRUD operations
- **v1.1.0** - Added stock validation and product validation
- **v1.2.0** - Implemented RESTful API design
- **v1.3.0** - Added comprehensive error handling and documentation

## 📄 License

This documentation is part of the E-commerce Cart API system. Please refer to the main project license for usage terms.

---

**Happy Coding! 🚀**

For the most up-to-date information, always refer to the latest version of this documentation.
