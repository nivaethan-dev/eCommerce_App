# E-commerce Application

A full-stack e-commerce application with Express.js 5 backend and Vite + React 19 frontend.

## Project Structure

```
ecommerce_app/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── database/seeds/   # Database seeders
│   ├── docs/             # API & security documentation
│   ├── eventTriggers/    # Event-driven notifications & audit logging
│   ├── middleware/       # Auth, rate limiting, upload, validation
│   ├── models/           # MongoDB/Mongoose models
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic layer
│   ├── utils/            # Utilities (tokens, cloudinary, errors)
│   ├── validation/       # Zod schemas & sanitization
│   ├── app.js            # Express app configuration
│   └── server.js         # Server entry point
└── frontend/
    └── src/
        ├── components/   # Reusable UI components
        ├── contexts/     # React context providers
        ├── hooks/        # Custom React hooks
        ├── pages/        # Page components
        ├── utils/        # API client & helpers
        └── App.jsx       # Root component
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
npm install
```

2. Create a `.env` file:
```env
HOST=localhost
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce_app

# JWT Secrets (use different values for each!)
CUSTOMER_JWT_SECRET=your-customer-access-secret
ADMIN_JWT_SECRET=your-admin-access-secret
CUSTOMER_REFRESH_JWT_SECRET=your-customer-refresh-secret
ADMIN_REFRESH_JWT_SECRET=your-admin-refresh-secret

# CORS
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=cloudcart/products
SERVE_LOCAL_UPLOADS=false
```

3. Start the server:
```bash
npm run dev
```

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
npm install
```

2. Create a `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

3. Start the dev server:
```bash
npm run dev
```

## Database Seeding

```bash
# Seed admin accounts
npm run seed:admin

# Seed customer accounts
npm run seed:customers

# Seed all (admin + customers)
npm run seed:all

# Seed products by category
npm run seed:products:category -- --category=Electronics --count=20

# Clear all data
npm run seed:clear

# Reset (clear + reseed)
npm run seed:reset
```

## API Routes

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login (customer/admin) | No |
| POST | `/api/auth/refresh-token` | Refresh access token | Cookie |
| POST | `/api/auth/logout` | Logout | Yes |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products | No |
| GET | `/api/products/:id` | Get product | No |
| POST | `/api/products/create` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Customer
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/customers/register` | Register | No |
| GET | `/api/customers/cart` | Get cart | Customer |
| POST | `/api/customers/cart/items` | Add to cart | Customer |
| PUT | `/api/customers/cart/items/:productId` | Update cart item | Customer |
| DELETE | `/api/customers/cart/items/:productId` | Remove from cart | Customer |
| POST | `/api/customers/orders` | Place order | Customer |
| GET | `/api/customers/orders` | Order history | Customer |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admins/customers` | List customers | Admin |
| GET | `/api/admins/orders` | List all orders | Admin |
| PUT | `/api/admins/orders/:orderId` | Update order status | Admin |

### Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get notifications | Yes |
| GET | `/api/notifications/unread-count` | Unread count | Yes |
| PUT | `/api/notifications/:id/read` | Mark as read | Yes |
| PUT | `/api/notifications/read-all` | Mark all read | Yes |
| DELETE | `/api/notifications/:id` | Delete notification | Yes |

### Audit Logs (Admin)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/audit-logs` | List audit logs | Admin |
| GET | `/api/audit-logs/stats` | Audit statistics | Admin |
| GET | `/api/audit-logs/:id` | Get log details | Admin |

## Security Features

- **Authentication**: JWT with separate access (15min) & refresh tokens (6h)
- **Authorization**: Role-based access control (customer/admin)
- **CSRF Protection**: SameSite=strict cookies
- **Rate Limiting**: Per-endpoint limits (login, register, cart, orders)
- **Input Validation**: Zod schemas with sanitization
- **Password Security**: bcrypt hashing with salt
- **IDOR Protection**: Token-based user identification
- **Account Lockout**: 5 failed attempts → 15min lock
- **NoSQL Injection**: mongo-sanitize middleware

## Technologies

### Backend
- Express.js 5 - Web framework
- MongoDB + Mongoose - Database
- JWT - Authentication
- Zod - Validation
- Cloudinary - Image hosting
- Sharp - Image processing
- express-rate-limit - Rate limiting

### Frontend
- React 19 - UI framework
- Vite - Build tool
- Context API - State management

## Documentation


## Troubleshooting

**MongoDB connection fails**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

**CORS errors**
- Verify `FRONTEND_URL` matches your frontend origin
- Ensure cookies are sent with `credentials: 'include'`

**Image upload fails**
- Check Cloudinary credentials
- Verify file type (JPEG, PNG, WebP, AVIF only)
- Max file size: 5MB
