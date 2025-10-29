# Missing Order Endpoints Documentation

## Overview

This document lists essential order endpoints that are currently **not implemented** but would enhance the order management system's functionality, user experience, and administrative capabilities.

---

## Priority Classifications

- 🔴 **High Priority**: Essential for basic functionality
- 🟡 **Medium Priority**: Important for enhanced user experience
- 🟢 **Low Priority**: Nice-to-have features for advanced functionality

---

## Missing Customer Endpoints

### 1. Get Single Order by ID
**Priority:** 🔴 High  
**Endpoint:** `GET /api/customers/orders/:orderId`  
**Description:** Retrieve a specific order by its ID for the authenticated customer.

**Use Cases:**
- View order details after placement
- Track order status
- Display order confirmation page
- Reorder functionality

**Request:**
```http
GET /api/customers/orders/507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "items": [...],
    "subTotal": 199.98,
    "tax": 16.00,
    "totalAmount": 215.98,
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Security Considerations:**
- Must verify customer owns the order
- Return 404 if order doesn't exist or customer doesn't have access

---

### 2. Cancel Order
**Priority:** 🔴 High  
**Endpoint:** `PUT /api/customers/orders/:orderId/cancel` or `DELETE /api/customers/orders/:orderId`  
**Description:** Allow customers to cancel their own orders (within a time limit).

**Use Cases:**
- Cancel orders before processing
- Refund requests
- Order modification needs

**Request:**
```http
PUT /api/customers/orders/507f1f77bcf86cd799439011/cancel
Authorization: Bearer <token>
```

**Business Rules Needed:**
- Only allow cancellation if status is "Pending" or "Processing"
- Implement time window (e.g., 24 hours) for cancellation
- Restore product stock when order is cancelled
- Prevent cancellation if order is already shipped

**Expected Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "Cancelled",
    ...
  }
}
```

---

### 3. Reorder
**Priority:** 🟡 Medium  
**Endpoint:** `POST /api/customers/orders/:orderId/reorder`  
**Description:** Add all items from a previous order back to the cart.

**Use Cases:**
- Quick reordering of favorite items
- Repeat purchases
- Convenience for customers

**Request:**
```http
POST /api/customers/orders/507f1f77bcf86cd799439011/reorder
Authorization: Bearer <token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Items added to cart successfully",
  "cart": {
    "items": [...],
    "summary": {...}
  }
}
```

**Business Rules:**
- Check if products still exist
- Validate current stock availability
- Add items to cart (may need quantity adjustment if stock is lower)

---

### 4. Filter Orders by Status
**Priority:** 🟡 Medium  
**Endpoint:** `GET /api/customers/orders?status=Delivered`  
**Description:** Filter customer orders by status.

**Use Cases:**
- View only pending orders
- Filter delivered orders for reviews
- Track shipped orders

**Implementation Note:**  
Add query parameter support to existing `GET /api/customers/orders` endpoint:
```http
GET /api/customers/orders?status=Pending
GET /api/customers/orders?status=Shipped
```

---

## Missing Admin Endpoints

### 5. Get Single Order by ID (Admin)
**Priority:** 🔴 High  
**Endpoint:** `GET /api/admins/orders/:orderId`  
**Description:** Retrieve detailed order information for admin management.

**Use Cases:**
- View complete order details
- Process orders manually
- Generate invoices
- Handle customer service inquiries

**Request:**
```http
GET /api/admins/orders/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "customer": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+94123456789",
      "address": {
        "street": "123 Main St",
        "city": "Colombo",
        "state": "Western",
        "zipCode": "00100",
        "country": "Sri Lanka"
      }
    },
    "items": [...],
    "subTotal": 199.98,
    "tax": 16.00,
    "totalAmount": 215.98,
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Note:** Should include full customer information (address, phone, etc.) for order processing.

---

### 6. Cancel Order (Admin)
**Priority:** 🟡 Medium  
**Endpoint:** `PUT /api/admins/orders/:orderId/cancel`  
**Description:** Allow admins to cancel any order with additional context.

**Request:**
```http
PUT /api/admins/orders/507f1f77bcf86cd799439011/cancel
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "Customer request",
  "restoreStock": true
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "Cancelled",
    ...
  }
}
```

**Business Rules:**
- Should be able to cancel from any status (with appropriate warnings)
- Option to restore stock
- Record cancellation reason for audit trail

---

### 7. Order Statistics
**Priority:** 🟡 Medium  
**Endpoint:** `GET /api/admins/orders/stats`  
**Description:** Retrieve order statistics for dashboard/reporting.

**Use Cases:**
- Dashboard metrics
- Business intelligence
- Performance monitoring

**Request:**
```http
GET /api/admins/orders/stats?period=30d
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `period`: Time period (e.g., `7d`, `30d`, `1y`, or date range)

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "totalOrders": 1250,
    "totalRevenue": 125000.50,
    "averageOrderValue": 100.00,
    "ordersByStatus": {
      "Pending": 45,
      "Processing": 32,
      "Shipped": 120,
      "Delivered": 980,
      "Cancelled": 73
    },
    "ordersByPeriod": {
      "today": 15,
      "thisWeek": 120,
      "thisMonth": 450,
      "thisYear": 1250
    },
    "topProducts": [
      {
        "productId": "...",
        "name": "Product Name",
        "quantitySold": 150,
        "revenue": 15000.00
      }
    ]
  }
}
```

---

### 8. Revenue Reports
**Priority:** 🟢 Low  
**Endpoint:** `GET /api/admins/orders/revenue`  
**Description:** Generate revenue reports with various filters and aggregations.

**Use Cases:**
- Financial reporting
- Tax calculations
- Business analysis

**Request:**
```http
GET /api/admins/orders/revenue?startDate=2024-01-01&endDate=2024-01-31&groupBy=day
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `startDate`: Start date for report (ISO format)
- `endDate`: End date for report (ISO format)
- `groupBy`: Grouping (`day`, `week`, `month`, `year`)
- `status`: Filter by order status

**Expected Response:**
```json
{
  "success": true,
  "report": {
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "totalRevenue": 50000.00,
    "totalOrders": 500,
    "averageOrderValue": 100.00,
    "revenueByPeriod": [
      {
        "period": "2024-01-01",
        "revenue": 1500.00,
        "orders": 15
      }
    ],
    "taxCollected": 4000.00
  }
}
```

---

### 9. Bulk Order Status Update
**Priority:** 🟢 Low  
**Endpoint:** `PUT /api/admins/orders/bulk-status`  
**Description:** Update multiple orders' status at once.

**Use Cases:**
- Batch processing of orders
- Bulk status updates
- Efficient order management

**Request:**
```http
PUT /api/admins/orders/bulk-status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "orderIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "status": "Shipped"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Orders updated successfully",
  "updatedCount": 2,
  "orders": [...]
}
```

---

### 10. Order Search
**Priority:** 🟡 Medium  
**Endpoint:** `GET /api/admins/orders/search`  
**Description:** Search orders by customer name, email, order ID, or product name.

**Request:**
```http
GET /api/admins/orders/search?q=john&limit=20
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `q`: Search query
- `limit`: Maximum results
- `skip`: Pagination offset

**Expected Response:**
```json
{
  "success": true,
  "orders": [...],
  "pagination": {
    "total": 15,
    "limit": 20,
    "skip": 0,
    "hasMore": false
  }
}
```

---

## Implementation Recommendations

### Phase 1 (High Priority) - Essential Functionality
1. `GET /api/customers/orders/:orderId` - View order details
2. `PUT /api/customers/orders/:orderId/cancel` - Cancel orders
3. `GET /api/admins/orders/:orderId` - Admin order details

### Phase 2 (Medium Priority) - Enhanced Features
4. `POST /api/customers/orders/:orderId/reorder` - Reorder functionality
5. `GET /api/customers/orders?status=...` - Status filtering
6. `GET /api/admins/orders/stats` - Order statistics
7. `GET /api/admins/orders/search` - Order search

### Phase 3 (Low Priority) - Advanced Features
8. `GET /api/admins/orders/revenue` - Revenue reports
9. `PUT /api/admins/orders/bulk-status` - Bulk operations

---

## Additional Considerations

### Order Status Tracking
- **Timestamps**: Track when order status changes (statusHistory)
- **User Notifications**: Notify customers when order status updates
- **Email Integration**: Send confirmation emails on status changes

### Stock Management on Cancellation
- **Automatic Restore**: Restore product stock when orders are cancelled
- **Notification**: Notify inventory management if stock is restored

### Audit Trail
- **Status Change Log**: Record who changed order status and when
- **Cancellation Reasons**: Store reasons for order cancellations

### Export Functionality
- **CSV Export**: Export orders to CSV for external analysis
- **PDF Invoices**: Generate PDF invoices for orders

---

## Summary

### Currently Implemented ✅
- `POST /api/customers/orders` - Place order
- `GET /api/customers/orders` - Get customer orders
- `GET /api/admins/orders` - List all orders (with pagination)
- `PUT /api/admins/orders/:orderId` - Update order status

### Missing High Priority 🔴
- Get single order by ID (customer)
- Get single order by ID (admin)
- Cancel order (customer)

### Missing Medium Priority 🟡
- Reorder functionality
- Status filtering for customers
- Order statistics
- Order search

### Missing Low Priority 🟢
- Revenue reports
- Bulk status updates

---

**Note:** This document should be updated as new endpoints are implemented or requirements change.

