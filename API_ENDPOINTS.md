# API Endpoints Documentation

## E-Commerce Web Application API Endpoints

---

## REST API Endpoints

### Authentication Endpoints

#### Customer Authentication
- `POST /api/customers/register` - Register a new customer
- `POST /api/auth/login` - Login for customer or admin
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout (requires authentication)

### Customer Endpoints

#### Cart Management
- `GET /api/customers/cart` - Retrieve customer's cart
- `POST /api/customers/cart/items` - Add item to cart
- `PUT /api/customers/cart/items/:productId` - Update cart item quantity
- `DELETE /api/customers/cart/items/:productId` - Remove item from cart

### Product Endpoints

- `GET /api/products` - List all products
- `POST /api/products/create` - Create new product (Admin only)

### Admin Endpoints

- `GET /api/admins/customers` - List all customers (Admin only)

### Static File Serving

- `GET /uploads/*` - Serve uploaded product images

---

---

## Missing Essential Endpoints

Based on the SRS requirements, the following minimal essential endpoints are missing:

### Order Management (FR-4)
- `POST /api/customers/orders` - Place order (simulated checkout)
- `GET /api/customers/orders` - Get customer order history
- `GET /api/admins/orders` - List all orders (Admin)
- `PUT /api/admins/orders/:orderId` - Update order status (Admin)

### Product Management (FR-1)
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Admin Dashboard (FR-5)
- `GET /api/admins/audit-logs` - View audit logs

### Notifications (SRS Feature)
- `GET /api/customers/notifications` - Get customer notifications
- `GET /api/admins/notifications` - Get admin notifications

---

## Notes

1. **Authentication**: All endpoints except `/api/customers/register` and `/api/auth/login` require JWT authentication via the `Authorization: Bearer <token>` header.

2. **Authorization**: Admin-only endpoints require `role: 'admin'` in the JWT payload.

3. **File Upload**: Product image upload is handled via `multipart/form-data` with middleware for validation and processing.

4. **Missing Critical Features**: Order management and notifications are required per SRS but not yet implemented.

5. **Static Files**: Product images are served from the `/uploads` directory (public access).
