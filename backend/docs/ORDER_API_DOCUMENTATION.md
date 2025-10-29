# 📦 Order API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Order Data Structure](#order-data-structure)
- [REST API Endpoints](#rest-api-endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [Error Handling](#error-handling)
- [Business Logic](#business-logic)
- [Implementation Details](#implementation-details)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Order API provides a complete order management system for the e-commerce application. It handles order creation from cart, order retrieval, and order status management for both customers and administrators.

### Key Features
- ✅ **RESTful Design** - Proper HTTP methods and resource naming
- ✅ **Cart to Order Conversion** - Seamless checkout process
- ✅ **Stock Management** - Automatic stock deduction on order placement
- ✅ **Order Snapshots** - Product details preserved at order time
- ✅ **Transaction Safety** - MongoDB transactions ensure data consistency
- ✅ **Status Management** - Admin-controlled order status workflow
- ✅ **Pagination Support** - Efficient handling of large order lists
- ✅ **Authentication & Authorization** - JWT-protected with role-based access

---

## Authentication

All order endpoints require authentication via JWT token.

### Headers Required
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Token Format
```javascript
// JWT payload structure for customers
{
  "id": "customer_mongodb_id",
  "role": "customer",
  "iat": 1234567890,
  "exp": 1234567890
}

// JWT payload structure for admins
{
  "id": "admin_mongodb_id",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Admin Endpoints
Admin-only endpoints require `role: 'admin'` in the JWT payload. Access attempts with customer role will return `403 Forbidden`.

---

## Order Data Structure

### Database Schema
```javascript
// Order model structure
const orderSchema = {
  customer: ObjectId,      // Reference to Customer model (required)
  items: [                 // Order items array
    {
      productId: ObjectId, // Reference to Product model (required)
      name: String,        // Product name snapshot at purchase time
      quantity: Number,    // Quantity ordered
      price: Number,       // Unit price snapshot at purchase time
      subtotal: Number     // price * quantity
    }
  ],
  subTotal: Number,         // Sum of all item subtotals
  tax: Number,             // Tax amount (calculated)
  totalAmount: Number,     // Final total (subTotal + tax)
  status: String,          // Order status: 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  createdAt: Date          // Order creation timestamp
}
```

### API Response Format
```javascript
// Standard API response structure
{
  "success": boolean,        // Operation success status
  "message": string,         // Human-readable message
  "order": {                 // Order object (single order responses)
    "_id": "ObjectId",
    "customer": {
      "_id": "ObjectId",
      "name": "Customer Name",
      "email": "customer@example.com"
    },
    "items": [
      {
        "productId": {
          "_id": "ObjectId",
          "title": "Product Name",
          "image": "uploads/products/product_123.jpg",
          "category": "Electronics"
        },
        "name": "Product Name",
        "quantity": 2,
        "price": 99.99,
        "subtotal": 199.98
      }
    ],
    "subTotal": 199.98,
    "tax": 16.00,
    "totalAmount": 215.98,
    "status": "Pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "orders": [...],           // Orders array (list responses)
  "pagination": {            // Pagination info (admin list endpoint)
    "total": 100,
    "limit": 50,
    "skip": 0,
    "hasMore": true
  }
}
```

---

## REST API Endpoints

### Customer Endpoints

#### Base URL
```
/api/customers
```

#### Endpoint Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/orders` | Place order from cart (checkout) | ✅ Customer |
| `GET` | `/orders` | Get customer's order history | ✅ Customer |

### Admin Endpoints

#### Base URL
```
/api/admins
```

#### Endpoint Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/orders` | List all orders with pagination | ✅ Admin |
| `PUT` | `/orders/:orderId` | Update order status | ✅ Admin |

---

## Request/Response Examples

### 1. Place Order (Customer)
**Convert cart items to a placed order. Cart is cleared after successful order creation.**

#### Request
```http
POST /api/customers/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Note:** No request body required. Order is created from the customer's current cart.

#### Success Response (201)
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "customer": {
      "_id": "507f191e810c19729de860ea",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "productId": {
          "_id": "507f1f77bcf86cd799439012",
          "title": "Wireless Headphones",
          "image": "uploads/products/product_abc123.jpg",
          "category": "Electronics"
        },
        "name": "Wireless Headphones",
        "quantity": 2,
        "price": 99.99,
        "subtotal": 199.98
      }
    ],
    "subTotal": 199.98,
    "tax": 16.00,
    "totalAmount": 215.98,
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses

**Empty Cart (400)**
```json
{
  "success": false,
  "error": "Cannot create order: cart is empty"
}
```

**Insufficient Stock (400)**
```json
{
  "success": false,
  "error": "Insufficient stock for product: Wireless Headphones. Available: 1, Requested: 2"
}
```

**Unauthorized (401)**
```json
{
  "success": false,
  "error": "Access token required"
}
```

---

### 2. Get Customer Order History
**Retrieve all orders placed by the authenticated customer.**

#### Request
```http
GET /api/customers/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "customer": "507f191e810c19729de860ea",
      "items": [
        {
          "productId": {
            "_id": "507f1f77bcf86cd799439012",
            "title": "Wireless Headphones",
            "image": "uploads/products/product_abc123.jpg",
            "category": "Electronics"
          },
          "name": "Wireless Headphones",
          "quantity": 2,
          "price": 99.99,
          "subtotal": 199.98
        }
      ],
      "subTotal": 199.98,
      "tax": 16.00,
      "totalAmount": 215.98,
      "status": "Pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Note:** Orders are sorted by most recent first (descending `createdAt`).

---

### 3. List All Orders (Admin)
**Retrieve all orders with optional filtering and pagination.**

#### Request
```http
GET /api/admins/orders?status=Pending&limit=50&skip=0
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | String | No | - | Filter by order status: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled` |
| `limit` | Number | No | 50 | Maximum number of orders to return (1-100) |
| `skip` | Number | No | 0 | Number of orders to skip (pagination offset) |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "customer": {
        "_id": "507f191e810c19729de860ea",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+94123456789"
      },
      "items": [
        {
          "productId": {
            "_id": "507f1f77bcf86cd799439012",
            "title": "Wireless Headphones",
            "image": "uploads/products/product_abc123.jpg",
            "category": "Electronics"
          },
          "name": "Wireless Headphones",
          "quantity": 2,
          "price": 99.99,
          "subtotal": 199.98
        }
      ],
      "subTotal": 199.98,
      "tax": 16.00,
      "totalAmount": 215.98,
      "status": "Pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "skip": 0,
    "hasMore": true
  }
}
```

#### Error Responses

**Invalid Limit (400)**
```json
{
  "success": false,
  "error": "Limit must be between 1 and 100"
}
```

**Invalid Skip (400)**
```json
{
  "success": false,
  "error": "Skip must be a non-negative number"
}
```

**Unauthorized (401)**
```json
{
  "success": false,
  "error": "Access token required"
}
```

**Forbidden (403)**
```json
{
  "success": false,
  "error": "Access denied: admin role required"
}
```

---

### 4. Update Order Status (Admin)
**Update the status of an existing order.**

#### Request
```http
PUT /api/admins/orders/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "Processing"
}
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | String | Yes | New order status. Must be one of: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled` |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "customer": {
      "_id": "507f191e810c19729de860ea",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [...],
    "subTotal": 199.98,
    "tax": 16.00,
    "totalAmount": 215.98,
    "status": "Processing",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses

**Order Not Found (404)**
```json
{
  "success": false,
  "error": "Order not found"
}
```

**Invalid Status (400)**
```json
{
  "success": false,
  "error": "Invalid status. Must be one of: Pending, Processing, Shipped, Delivered, Cancelled"
}
```

**Missing Status (400)**
```json
{
  "success": false,
  "error": "Status is required"
}
```

---

## Error Handling

### Error Response Format
All errors follow a consistent format:
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| `400` | Bad Request | Invalid input, missing required fields, validation failures |
| `401` | Unauthorized | Missing or invalid authentication token |
| `403` | Forbidden | Valid token but insufficient permissions (admin role required) |
| `404` | Not Found | Order doesn't exist or customer not found |
| `500` | Internal Server Error | Server-side errors, database issues |

### Error Handling Best Practices

1. **Always Check Status Code**: Don't rely solely on `success` field
2. **Handle Specific Errors**: Check error messages for specific scenarios
3. **Implement Retry Logic**: For 500 errors, implement exponential backoff
4. **User-Friendly Messages**: Display error messages to users appropriately
5. **Log Errors**: Log errors for debugging while showing user-friendly messages

---

## Business Logic

### Order Placement Flow

1. **Cart Validation**: System checks if cart is not empty
2. **Stock Validation**: Validates stock availability for each cart item
3. **Item Processing**: 
   - Creates order items with product snapshots
   - Validates stock before processing each item
   - Throws error if any item has insufficient stock
4. **Stock Deduction**: Updates product stock in database
5. **Order Calculation**: Calculates subtotal, tax, and total amount
6. **Order Creation**: Creates order in database within transaction
7. **Cart Clearing**: Clears customer's cart after successful order
8. **Response**: Returns created order with populated product details

### Order Status Workflow

The order status follows this lifecycle:
```
Pending → Processing → Shipped → Delivered
                    ↓
                 Cancelled
```

- **Pending**: Initial status when order is placed
- **Processing**: Order is being prepared
- **Shipped**: Order has been shipped to customer
- **Delivered**: Order delivery confirmed
- **Cancelled**: Order has been cancelled (can be set from any status)

### Financial Calculations

Order totals are calculated as follows:
- **SubTotal**: Sum of all item subtotals (price × quantity for each item)
- **Tax**: Calculated as `subTotal × taxRate` (currently 8%)
- **TotalAmount**: `subTotal + tax`

**Note:** No shipping fees or discounts are applied.

### Product Snapshots

Order items store product information at the time of purchase:
- **name**: Product title snapshot
- **price**: Unit price snapshot
- **quantity**: Quantity ordered
- **subtotal**: Calculated snapshot (price × quantity)

This ensures historical accuracy even if product details change later.

---

## Implementation Details

### Transaction Safety

Order placement uses MongoDB transactions to ensure:
- **Atomicity**: All operations succeed or all fail
- **Consistency**: Database remains consistent if errors occur
- **Stock Safety**: Stock is only deducted if order is successfully created

### Stock Management

1. **Pre-validation**: Stock is checked before processing
2. **Atomic Updates**: Stock updates happen within transaction
3. **Error Prevention**: Order fails if stock is insufficient
4. **Concurrency**: Transaction isolation prevents race conditions

### Data Population

Order responses include populated references:
- **Customer**: Name, email, phone, address (admin endpoints)
- **Product**: Title, image, category, description

This reduces frontend API calls by providing complete data in one response.

---

## Best Practices

### For Customers

1. **Check Cart Before Order**: Always verify cart contents before placing order
2. **Handle Stock Errors**: Implement user-friendly messages for stock issues
3. **Display Order Confirmations**: Show order details after successful placement
4. **Order History**: Display orders sorted by most recent first

### For Administrators

1. **Status Updates**: Update order status in workflow sequence
2. **Pagination**: Always use pagination for order lists
3. **Filtering**: Use status filters to manage order workflow
4. **Audit Trail**: Log status changes for accountability

### API Integration

1. **Error Handling**: Implement comprehensive error handling
2. **Loading States**: Show loading indicators during order placement
3. **Optimistic Updates**: Update UI after successful order placement
4. **Token Management**: Handle token expiration gracefully

---

## Troubleshooting

### Common Issues

#### 1. "Cart is empty" Error
**Problem**: Attempting to place order with empty cart

**Solution**: 
- Verify cart has items: `GET /api/customers/cart`
- Add items to cart before placing order

#### 2. "Insufficient stock" Error
**Problem**: Product stock is less than requested quantity

**Solution**:
- Check product stock levels
- Reduce quantity in cart
- Remove out-of-stock items

#### 3. "Order not found" Error
**Problem**: Order ID doesn't exist or invalid

**Solution**:
- Verify order ID is correct
- Check if order exists in database
- Ensure user has access to the order

#### 4. Authentication Errors
**Problem**: 401 or 403 errors

**Solution**:
- Verify JWT token is valid and not expired
- Check token in Authorization header format
- For admin endpoints, verify role is 'admin'

#### 5. Status Update Validation Error
**Problem**: Invalid status value

**Solution**:
- Use only valid statuses: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`
- Check status is sent as string in request body

### Debugging Steps

#### 1. Verify Authentication
```javascript
// Check token in request headers
Authorization: Bearer <valid_jwt_token>
```

#### 2. Check Cart Contents
```javascript
// Verify cart has items
GET /api/customers/cart
```

#### 3. Validate Stock Levels
```javascript
// Check product stock availability
GET /api/products/{productId}
```

#### 4. Monitor Order Creation
```javascript
// Check order was created
GET /api/customers/orders
```

---

## Conclusion

This Order API provides a robust, production-ready order management system that handles the complete order lifecycle from cart to delivery. It ensures data consistency through transactions, maintains historical accuracy with product snapshots, and provides comprehensive error handling.

For questions or issues, refer to the troubleshooting section or check the error responses for specific guidance.

