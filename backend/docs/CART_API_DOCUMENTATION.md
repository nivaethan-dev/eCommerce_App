# 🛒 Cart API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Cart Data Structure](#cart-data-structure)
- [REST API Endpoints](#rest-api-endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [Error Handling](#error-handling)
- [Business Logic](#business-logic)
- [Implementation Details](#implementation-details)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Cart API provides a complete shopping cart system for the e-commerce application. It follows REST principles and includes comprehensive validation, stock management, and error handling.

### Key Features
- ✅ **RESTful Design** - Proper HTTP methods and resource naming
- ✅ **Stock Validation** - Prevents overselling
- ✅ **Product Validation** - Ensures data integrity
- ✅ **Authentication** - JWT-protected endpoints
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Data Population** - Returns full product details

---

## Authentication

All cart endpoints require authentication via JWT token.

### Headers Required
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Token Format
```javascript
// JWT payload structure
{
  "id": "customer_mongodb_id",
  "role": "customer",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Cart Data Structure

### Database Schema
```javascript
// Customer model cart structure
const customerSchema = {
  // ... other fields
  cart: [
    {
      productId: ObjectId,    // Reference to Product model
      quantity: Number,       // Quantity in cart (default: 1)
      addedAt: Date          // When item was added (default: Date.now)
    }
  ]
}
```

### API Response Format
```javascript
// Standard API response structure
{
  "success": boolean,        // Operation success status
  "message": string,         // Human-readable message
  "cart": [                  // Cart items array
    {
      "productId": "ObjectId",
      "quantity": 2,
      "addedAt": "2024-01-01T00:00:00.000Z",
      "product": {            // Populated product details
        "_id": "ObjectId",
        "title": "Product Name",
        "description": "Product Description",
        "price": 99.99,
        "image": "uploads/products/product_123.jpg",
        "stock": 10,
        "category": "Electronics"
      }
    }
  ]
}
```

---

## REST API Endpoints

### Base URL
```
/api/customers
```

### Endpoint Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/cart` | Retrieve customer's cart | ✅ |
| `POST` | `/cart/items` | Add item to cart | ✅ |
| `PUT` | `/cart/items/:productId` | Update item quantity | ✅ |
| `DELETE` | `/cart/items/:productId` | Remove item from cart | ✅ |

---

## Request/Response Examples

### 1. Get Cart
**Retrieve the customer's current cart with product details.**

#### Request
```http
GET /api/customers/cart
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "cart": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "addedAt": "2024-01-15T10:30:00.000Z",
      "product": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": 199.99,
        "image": "uploads/products/product_123.jpg",
        "stock": 15,
        "category": "Electronics",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      }
    },
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 1,
      "addedAt": "2024-01-15T11:00:00.000Z",
      "product": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Smartphone Case",
        "description": "Protective case for iPhone 15",
        "price": 29.99,
        "image": "uploads/products/product_124.jpg",
        "stock": 50,
        "category": "Accessories",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      }
    }
  ]
}
```

#### Empty Cart Response (200)
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "cart": []
}
```

---

### 2. Add Item to Cart
**Add a product to the customer's cart with quantity validation.**

#### Request
```http
POST /api/customers/cart/items
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

#### Success Response (201)
```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "cart": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "addedAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

#### Adding to Existing Item Response (201)
```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "cart": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 4,  // 2 + 2 = 4
      "addedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Validation Error Response (400)
```json
{
  "success": false,
  "error": "Product ID is required"
}
```

#### Stock Error Response (400)
```json
{
  "success": false,
  "error": "Only 5 items available in stock. You already have 3 in your cart."
}
```

#### Product Not Found Error (400)
```json
{
  "success": false,
  "error": "Product not found"
}
```

#### Out of Stock Error (400)
```json
{
  "success": false,
  "error": "Product is out of stock"
}
```

---

### 3. Update Item Quantity
**Update the quantity of a specific item in the cart.**

#### Request
```http
PUT /api/customers/cart/items/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "quantity": 3
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Cart quantity updated successfully",
  "cart": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 3,
      "addedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Remove Item (Set Quantity to 0) Response (200)
```json
{
  "success": true,
  "message": "Product removed from cart successfully",
  "cart": []
}
```

#### Validation Error Response (400)
```json
{
  "success": false,
  "error": "Quantity is required"
}
```

#### Stock Error Response (400)
```json
{
  "success": false,
  "error": "Only 5 items available in stock"
}
```

#### Item Not in Cart Error (400)
```json
{
  "success": false,
  "error": "Product not found in cart"
}
```

---

### 4. Remove Item from Cart
**Remove a specific item from the cart completely.**

#### Request
```http
DELETE /api/customers/cart/items/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Product removed from cart successfully",
  "cart": [
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 1,
      "addedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

#### Empty Cart After Removal Response (200)
```json
{
  "success": true,
  "message": "Product removed from cart successfully",
  "cart": []
}
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Description | When Used |
|-------------|-------------|-----------|
| `200` | OK | Successful GET, PUT, DELETE operations |
| `201` | Created | Successful POST operations |
| `400` | Bad Request | Validation errors, stock issues, product not found |
| `401` | Unauthorized | Missing or invalid JWT token |
| `500` | Internal Server Error | Server-side errors |

### Error Response Format
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Error Scenarios

#### 1. Authentication Errors
```json
// Missing token
{
  "success": false,
  "error": "Access token required"
}

// Invalid token
{
  "success": false,
  "error": "Invalid or expired token"
}
```

#### 2. Validation Errors
```json
// Missing required fields
{
  "success": false,
  "error": "Product ID is required"
}

// Invalid quantity
{
  "success": false,
  "error": "Quantity must be at least 1"
}

// Negative quantity
{
  "success": false,
  "error": "Quantity cannot be negative"
}
```

#### 3. Business Logic Errors
```json
// Stock-related errors
{
  "success": false,
  "error": "Product is out of stock"
}

{
  "success": false,
  "error": "Only 5 items available in stock"
}

// Product-related errors
{
  "success": false,
  "error": "Product not found"
}

{
  "success": false,
  "error": "Product not found in cart"
}
```

---

## Business Logic

### Cart Operations Logic

#### 1. Add to Cart Logic
```javascript
// Pseudocode for add to cart
if (product exists && product.stock > 0) {
  if (product already in cart) {
    if (current_quantity + new_quantity <= product.stock) {
      update_quantity(current_quantity + new_quantity)
    } else {
      throw error("Insufficient stock")
    }
  } else {
    if (new_quantity <= product.stock) {
      add_new_item(productId, quantity)
    } else {
      throw error("Insufficient stock")
    }
  }
} else {
  throw error("Product not found or out of stock")
}
```

#### 2. Update Quantity Logic
```javascript
// Pseudocode for update quantity
if (product exists && quantity >= 0) {
  if (quantity === 0) {
    remove_item_from_cart()
  } else {
    if (quantity <= product.stock) {
      update_item_quantity(quantity)
    } else {
      throw error("Insufficient stock")
    }
  }
} else {
  throw error("Invalid product or quantity")
}
```

#### 3. Stock Validation Rules
- ✅ Product must exist in database
- ✅ Product must have stock > 0
- ✅ Requested quantity cannot exceed available stock
- ✅ Total cart quantity cannot exceed available stock
- ✅ Quantity must be a positive integer

---

## Implementation Details

### Database Operations

#### 1. Cart Storage
```javascript
// Cart items are stored as subdocuments in Customer model
const customer = {
  _id: "customer_id",
  cart: [
    {
      productId: ObjectId("product_id"),
      quantity: 2,
      addedAt: Date
    }
  ]
}
```

#### 2. Product Population
```javascript
// When retrieving cart, products are populated
const customer = await Customer.findById(customerId)
  .populate('cart.productId');
```

#### 3. Data Cleanup
```javascript
// Invalid products are automatically removed
const validCartItems = customer.cart.filter(item => item.productId !== null);
```

### Service Layer Architecture

#### 1. Separation of Concerns
- **Controllers**: Handle HTTP requests/responses
- **Services**: Handle business logic
- **Models**: Handle data persistence

#### 2. Error Propagation
```javascript
// Service throws specific errors
throw new Error('Product not found');

// Controller catches and formats for HTTP
catch (err) {
  if (err.message.includes('not found')) {
    return res.status(400).json({ success: false, error: err.message });
  }
}
```

---

## Best Practices

### 1. API Design
- ✅ Use proper HTTP methods (GET, POST, PUT, DELETE)
- ✅ Follow RESTful URL patterns
- ✅ Use meaningful status codes
- ✅ Provide consistent response format

### 2. Error Handling
- ✅ Validate input at controller level
- ✅ Handle business logic errors in service layer
- ✅ Provide meaningful error messages
- ✅ Use appropriate HTTP status codes

### 3. Security
- ✅ Authenticate all cart operations
- ✅ Validate user ownership of cart
- ✅ Sanitize input data
- ✅ Use parameterized queries

### 4. Performance
- ✅ Use database indexes on frequently queried fields
- ✅ Populate related data efficiently
- ✅ Minimize database queries
- ✅ Handle concurrent access properly

---

## Troubleshooting

### Common Issues

#### 1. "Product not found" Error
**Cause**: Product ID doesn't exist in database
**Solution**: Verify product ID is correct and product exists

#### 2. "Out of stock" Error
**Cause**: Product has no available stock
**Solution**: Check product stock levels, update inventory

#### 3. "Only X items available" Error
**Cause**: Requested quantity exceeds available stock
**Solution**: Reduce quantity or check stock levels

#### 4. "Product not found in cart" Error
**Cause**: Trying to update/remove item not in cart
**Solution**: Verify product ID and check current cart contents

#### 5. Authentication Errors
**Cause**: Missing or invalid JWT token
**Solution**: Ensure valid token in Authorization header

### Debugging Tips

#### 1. Check Request Format
```javascript
// Ensure proper request structure
{
  "productId": "valid_object_id",
  "quantity": 1  // positive integer
}
```

#### 2. Verify Authentication
```javascript
// Check token in request headers
Authorization: Bearer <valid_jwt_token>
```

#### 3. Check Product Status
```javascript
// Verify product exists and has stock
GET /api/products/{productId}
```

#### 4. Monitor Cart State
```javascript
// Check current cart contents
GET /api/customers/cart
```

---

## Learning Resources

### REST API Concepts
- **Resource-Based URLs**: `/cart` represents cart resource
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (remove)
- **Status Codes**: 200 (success), 201 (created), 400 (client error), 500 (server error)

### E-commerce Patterns
- **Stock Management**: Prevent overselling
- **Cart Persistence**: Store cart in database
- **User Isolation**: Each user has separate cart
- **Data Validation**: Validate all inputs

### Database Design
- **Subdocuments**: Store cart items as array in customer document
- **References**: Use ObjectId to reference products
- **Population**: Join related data when needed
- **Validation**: Ensure data integrity

---

## Conclusion

This Cart API provides a robust, production-ready shopping cart system that follows REST principles and includes comprehensive validation and error handling. It's designed to be both developer-friendly and user-focused, making it an excellent foundation for any e-commerce application.

For questions or issues, refer to the troubleshooting section or check the error responses for specific guidance.
