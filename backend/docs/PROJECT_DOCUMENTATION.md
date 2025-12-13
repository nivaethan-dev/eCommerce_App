## Group Members: Group 10

| Member | Index Number |
| --- | --- |
| R. Nivaethan (Scrum Master) | FC222008 |
| M.N.F Afrina | FC222001 |
| K.G.A.K.Sathsarani | FC222015 |
| W.D.C.S.GUNATHUNGA | FC222017 |

---

# **1. Product Backlog**

| ID | User Story (Description) | Priority | Story Points | Sprint | Status |
| --- | --- | --- | --- | --- | --- |
| PB01 | As a guest, I want to register an account so I can access user features | High | 5 | Sprint 1 | ✅ Completed |
| PB02 | As a registered user, I want to login securely using JWT so I can access my account | High | 5 | Sprint 1 | ✅ Completed |
| PB03 | As a user, I want to reset my password so I can regain access if I forget it | Medium | 3 | Sprint 1 | ⏳ Partial (Schema ready) |
| PB04 | As a user, I want to browse products so I can see what is available | High | 5 | Sprint 1 | ✅ Completed |
| PB05 | As a developer, I want input validation and sanitization on all forms so the system is secure | High | 5 | Sprint 1 | ✅ Completed |
| PB06 | As a developer, I want HTTPS and security headers configured so communication is secure | High | 3 | Sprint 1 | ✅ Completed |
| PB07 | As a customer, I want to add products to my cart so I can buy multiple items | High | 8 | Sprint 2 | ✅ Completed |
| PB08 | As a customer, I want to place a simulated order so I can test the checkout process | High | 8 | Sprint 2 | ✅ Completed |
| PB09 | As an admin, I want to create, read, update, and delete products so I can manage inventory | High | 8 | Sprint 2 | ✅ Completed (Create & Read) |
| PB10 | As an admin, I want to view all orders so I can manage order fulfillment | Medium | 5 | Sprint 2 | ✅ Completed |
| PB11 | As a customer, I want my cart to persist so I don't lose items if I logout | Medium | 5 | Sprint 2 | ✅ Completed |
| PB12 | As a developer, I want sensitive fields encrypted in the database so data is secure | Medium | 3 | Sprint 2 | ✅ Completed (Password hashing) |
| PB13 | As a user, I want to search/filter products so I can find items easily | High | 5 | Sprint 3 | ✅ Completed (Backend) |
| PB14 | As a user/admin, I want notifications so I can be informed of actions like orders or updates | Medium | 5 | Sprint 3 | ⏳ Partial (UI ready) |
| PB15 | As a user, I want order confirmation placeholders so I know my order is placed | Medium | 3 | Sprint 3 | ⏳ Pending |
| PB16 | As a developer, I want CSRF, session security, and RBAC enforced so the system is secure | High | 8 | Sprint 3 | ✅ Completed (RBAC) |
| PB17 | As a user, I want pagination on products/orders so pages load quickly | Medium | 3 | Sprint 3 | ✅ Completed (Backend) |
| PB18 | As a user, I want a polished responsive UI so I can use the system comfortably | High | 5 | Sprint 3 | ✅ Completed |
| PB19 | As a developer, I want unit, integration, and basic security tests so system quality is assured | High | 8 | Sprint 3 | ⏳ Partial (Setup ready) |

---

# **2. Sprint Backlog**

| Task ID | Description | Assignee | Story Points | Status |
| --- | --- | --- | --- | --- |
| S1-T1 | User registration | Dev A | 3 | ✅ Completed |
| S1-T2 | Secure login/logout with JWT | Dev B | 3 | ✅ Completed |
| S1-T3 | Password reset functionality | Dev C | 2 | ⏳ Partial |
| S1-T4 | Product listing page (frontend) | Dev D | 3 | ✅ Completed |
| S1-T5 | Backend API for product listing | Dev E | 2 | ✅ Completed |
| S1-T6 | Server-side input validation & sanitization | Dev A | 3 | ✅ Completed |
| S1-T7 | Configure HTTPS, security headers, env vars | Dev B | 3 | ✅ Completed |
| S1-T8 | MongoDB schema for Users and Products | Dev C | 2 | ✅ Completed |
| S2-T1 | Persistent shopping cart | Dev A | 3 | ✅ Completed |
| S2-T2 | Add/update/remove items in cart | Dev B | 3 | ✅ Completed |
| S2-T3 | Simulated order placement | Dev C | 4 | ✅ Completed |
| S2-T4 | Backend Order schema & link to Customer | Dev D | 2 | ✅ Completed |
| S2-T5 | Admin CRUD for products | Dev E | 4 | ✅ Completed (Create/Read) |
| S2-T6 | Admin view for orders | Dev A | 2 | ✅ Completed |
| S2-T7 | Database encryption for sensitive fields | Dev B | 3 | ✅ Completed |
| S2-T8 | Unit + integration tests | Dev C | 3 | ⏳ Setup ready |
| S3-T1 | Product search & filters | Dev A | 3 | ✅ Completed (Backend) |
| S3-T2 | Notifications for users/admins | Dev B | 3 | ⏳ Partial |
| S3-T3 | Order confirmation messages + order details page | Dev C | 2 | ⏳ Pending |
| S3-T4 | CSRF, session security, RBAC | Dev D | 4 | ✅ Completed (RBAC) |
| S3-T5 | Pagination for product & order listings | Dev E | 2 | ✅ Completed (Backend) |
| S3-T6 | Responsive UI & frontend polish | Dev A | 3 | ✅ Completed |
| S3-T7 | Unit, integration, basic security tests | Dev B | 4 | ⏳ Setup ready |
| S3-T8 | Final integration testing & bug fixes | All | 4 | 🔄 In Progress |

---

# 3. Sprint Plan

## **Sprint 1 (Weeks 1–2)**

**Sprint Goal:** Build foundational user authentication, secure setup, and product browsing.

### **Sprint Backlog**

| Task ID | Task Description | Assigned To | Story Points | Related PB | Status |
| --- | --- | --- | --- | --- | --- |
| S1-T1 | Implement user registration (frontend + backend) | Dev A | 3 | PB01 | ✅ |
| S1-T2 | Implement secure login/logout with JWT | Dev B | 3 | PB02 | ✅ |
| S1-T3 | Implement password reset functionality | Dev C | 2 | PB03 | ⏳ |
| S1-T4 | Build product listing page with sample products (frontend) | Dev D | 3 | PB04 | ✅ |
| S1-T5 | Implement backend API for product listing | Dev E | 2 | PB04 | ✅ |
| S1-T6 | Add server-side input validation & sanitization | Dev A | 3 | PB05 | ✅ |
| S1-T7 | Configure HTTPS, security headers, and environment variables | Dev B | 3 | PB06 | ✅ |
| S1-T8 | Setup MongoDB schema for Users and Products | Dev C | 2 | PB01, PB04 | ✅ |

## **Sprint 2 (Weeks 3–4)**

**Sprint Goal:** Enable cart, orders, and basic admin product management.

### **Sprint Backlog**

| Task ID | Task Description | Assigned To | Story Points | Related PB | Status |
| --- | --- | --- | --- | --- | --- |
| S2-T1 | Implement persistent shopping cart (frontend + backend) | Dev A | 3 | PB07, PB11 | ✅ |
| S2-T2 | Implement add/update/remove items in cart | Dev B | 3 | PB07 | ✅ |
| S2-T3 | Implement simulated order placement | Dev C | 4 | PB08 | ✅ |
| S2-T4 | Create backend Order schema and link to Customer | Dev D | 2 | PB08 | ✅ |
| S2-T5 | Implement admin CRUD for products | Dev E | 4 | PB09 | ✅ |
| S2-T6 | Implement admin view for orders | Dev A | 2 | PB10 | ✅ |
| S2-T7 | Implement database encryption for sensitive fields | Dev B | 3 | PB12 | ✅ |
| S2-T8 | Test all Sprint 2 functionality (unit + integration) | Dev C | 3 | PB07-PB12 | ⏳ |

## **Sprint 3 (Weeks 5–6)**

**Sprint Goal:** Complete remaining features, UI polish, search, notifications, and security hardening.

### **Sprint Backlog**

| Task ID | Task Description | Assigned To | Story Points | Related PB | Status |
| --- | --- | --- | --- | --- | --- |
| S3-T1 | Implement product search and filters | Dev A | 3 | PB13 | ✅ |
| S3-T2 | Implement notifications for users/admins | Dev B | 3 | PB14 | ⏳ |
| S3-T3 | Add order confirmation messages and order details page | Dev C | 2 | PB15 | ⏳ |
| S3-T4 | Implement CSRF, session security, and RBAC | Dev D | 4 | PB16 | ✅ |
| S3-T5 | Add pagination to product and order listings | Dev E | 2 | PB17 | ✅ |
| S3-T6 | Finalize responsive UI and frontend polish | Dev A | 3 | PB18 | ✅ |
| S3-T7 | Implement unit, integration, and basic security tests | Dev B | 4 | PB19 | ⏳ |
| S3-T8 | Conduct final integration testing and bug fixes | All | 4 | PB13-PB19 | 🔄 |

## **Project Sprint Planning Summary**

| Sprint | Duration | Sprint Goal | Key Deliverables | Status |
| --- | --- | --- | --- | --- |
| Sprint 1 | Weeks 1–2 | Setup secure authentication and basic product browsing | User registration/login, product listing, input validation, HTTPS setup, MongoDB schemas | ✅ Completed |
| Sprint 2 | Weeks 3–4 | Enable cart, orders, and admin product management | Shopping cart CRUD, simulated order placement, admin product CRUD, database encryption, unit/integration tests | ✅ Mostly Complete |
| Sprint 3 | Weeks 5–6 | Complete search, notifications, UI polish, and security hardening | Product search, notifications, order confirmation, CSRF/session/RBAC security, responsive UI, final tests | 🔄 In Progress |

---

# **4. Increment Summary**

## **Sprint 1 (Weeks 1–2)**

**Deliverables:**

- **Frontend (Vite + React)**:
    - User registration page with form validation
    - Login page with form validation
    - Home page with hero section and category showcase
    - Header component with navigation, search bar, cart icon, and profile dropdown
    - Footer component
    - Layout component structure
    - Responsive CSS with dark mode support

- **Backend (Node.js + Express + MongoDB)**:
    - Authentication endpoints (register, login, logout)
    - Unified login for both Customer and Admin
    - JWT-based authentication with access and refresh tokens
    - **Refresh token rotation** for enhanced security
    - **httpOnly cookies** for secure token storage
    - MongoDB schemas for Customer, Admin, and Product
    - Server-side input validation using validator library
    - **Rate limiting** for login (5 attempts/15 min) and registration (3 attempts/hour)
    - Product listing API with search and pagination support

- **Security**:
    - HTTPS configuration ready, environment variables setup
    - JWT-based authentication with separate secrets for admin/customer
    - Password hashing with bcrypt (10 rounds)
    - CORS configuration for frontend origin
    - Cookie-based authentication with secure options

**Contribution to system:**

Establishes the **core user authentication and product browsing framework**, including secure handling of credentials, rate limiting protection, and basic database setup with proper schema design.

---

## **Sprint 2 (Weeks 3–4)**

**Deliverables:**

- **Frontend (Vite + React)**:
    - Cart UI integration in Header (item count badge)
    - Profile dropdown with navigation links
    - Notification UI placeholder
    - API utility functions (get, post, put, del)
    - Auth state management using localStorage flags and custom events

- **Backend (Node.js + Express + MongoDB)**:
    - **Persistent Shopping Cart** embedded in Customer document
    - Cart REST API endpoints:
      - `GET /api/customers/cart` - Retrieve cart with summary
      - `POST /api/customers/cart/items` - Add item to cart
      - `PUT /api/customers/cart/items/:productId` - Update item quantity
      - `DELETE /api/customers/cart/items/:productId` - Remove item from cart
    - **Cart Summary Calculations** with subtotal, tax (8%), and total in LKR currency
    - **Stock Validation** to prevent overselling
    - **MongoDB Transactions** for cart and order operations ensuring atomicity
    - Order APIs:
      - `POST /api/customers/orders` - Place order (simulated checkout)
      - `GET /api/customers/orders` - Get customer order history
    - Admin Order Management:
      - `GET /api/admins/orders` - List all orders with pagination and status filter
      - `PUT /api/admins/orders/:orderId` - Update order status
    - Admin Customer Management:
      - `GET /api/admins/customers` - Fetch all customers
    - **Order Status Workflow**: Pending → Processing → Shipped → Delivered / Cancelled
    - Admin CRUD APIs for products:
      - `POST /api/products/create` - Create product with image upload
    - **Product Image Processing**:
      - Multer for file upload
      - Sharp for image resizing (800x600) and optimization
      - File type validation using file-type package
      - Support for JPG, PNG, WEBP, AVIF formats
    - Database encryption via password hashing with bcrypt
    - **Custom Error Classes**: CartError, StockError, ProductError, ValidationError, DatabaseError
    - **Centralized Message Constants** for cart and order operations

- **Testing**:
    - Jest and Supertest configured in package.json
    - Test scripts ready for implementation

- **Database Tooling**:
    - **Database Seeding Scripts**:
      - `npm run seed:admin` - Seed admin user
      - `npm run seed:customers` - Seed customers
      - `npm run seed:all` - Seed all data
      - `npm run seed:reset` - Reset and reseed
      - `npm run seed:clear` - Clear all data

**Contribution to system:**

Adds **shopping and order functionality** and **admin management**, enabling core business operations while maintaining secure backend integration with transaction support and atomic stock management.

---

## **Sprint 3 (Weeks 5–6)**

**Deliverables:**

- **Frontend (Vite + React)**:
    - Product search integration in Header
    - Category selection dropdown
    - Responsive UI improvements for mobile and desktop
    - Dark mode support via CSS media queries
    - Animation effects (fadeInUp, hover transitions)
    - Category showcase on home page

- **Backend (Node.js + Express + MongoDB)**:
    - Security hardening: 
      - **RBAC enforcement** via roleMiddleware
      - Session security with httpOnly cookies
      - Rate limiting middleware
    - Enhanced product APIs supporting:
      - Text search across title, description, category
      - Pagination with configurable limit and page
    - Order APIs with:
      - Status filtering
      - Pagination (limit, skip)
    - **Product Categories Validation**: Electronics, Clothing, Books, Home & Kitchen, Sports, Toys
    - Static file serving for uploaded images

- **Testing & Deployment:**
    - Jest testing framework configured
    - Vite proxy configuration for development API calls
    - Build scripts ready (`npm run build`)
    - Environment-based configuration (development/production)

**Contribution to system:**

Completes **full functional and secure e-commerce application**, ready for demonstration, penetration testing, and evaluation.

---

# **5. Technical Architecture**

## **5.1 Technology Stack**

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v16+ | Runtime environment |
| Express.js | 5.1.0 | Web framework |
| MongoDB | - | Database |
| Mongoose | 8.19.1 | ODM for MongoDB |
| JWT (jsonwebtoken) | 9.0.2 | Authentication |
| bcryptjs | 3.0.2 | Password hashing |
| Multer | 2.0.2 | File upload handling |
| Sharp | 0.34.4 | Image processing |
| validator | 13.15.15 | Input validation |
| express-rate-limit | 8.1.0 | Rate limiting |
| helmet | 8.1.0 | Security headers |
| cookie-parser | 1.4.7 | Cookie handling |
| cors | 2.8.5 | Cross-origin resource sharing |
| nodemailer | 7.0.9 | Email functionality |

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library |
| Vite | 7.2.4 | Build tool & dev server |
| React Router DOM | 7.9.6 | Client-side routing |
| ESLint | 9.39.1 | Code linting |

### **Development Tools**
| Tool | Purpose |
|------|---------|
| nodemon | Backend auto-restart |
| Jest | Testing framework |
| Supertest | HTTP testing |

---

## **5.2 Project Structure**

```
ecommerce_app/
├── backend/
│   ├── config/
│   │   └── dbConnection.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Login, logout, refresh token
│   │   ├── customerController.js    # Registration, cart operations
│   │   ├── orderController.js       # Order management
│   │   └── productController.js     # Product operations
│   ├── database/
│   │   └── seeds/                   # Database seeding scripts
│   │       ├── AdminSeeder.js
│   │       ├── CustomerSeeder.js
│   │       └── index.js
│   ├── docs/                        # API documentation
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── rateLimitMiddleware.js   # Rate limiting
│   │   ├── roleMiddleware.js        # RBAC
│   │   └── uploadMiddleware.js      # Image upload & processing
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Customer.js              # Includes embedded cart
│   │   ├── Order.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   └── productRoutes.js
│   ├── services/
│   │   ├── customerService.js       # Cart business logic
│   │   ├── orderService.js          # Order business logic
│   │   └── productService.js        # Product business logic
│   ├── utils/
│   │   ├── cartErrors.js            # Custom error classes
│   │   ├── cartMessages.js          # Cart message constants
│   │   ├── cartSummaryUtils.js      # Cart calculations
│   │   ├── orderCalculationUtils.js # Order calculations
│   │   ├── orderMessages.js         # Order message constants
│   │   ├── queryHelper.js           # Search & pagination
│   │   ├── securityUtils.js         # Password utilities
│   │   └── tokenUtils.js            # JWT utilities
│   ├── uploads/                     # Uploaded files
│   │   └── products/                # Product images
│   ├── app.js                       # Express app configuration
│   ├── server.js                    # Server entry point
│   └── package.json
│
├── frontend/
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Navigation header
│   │   │   ├── Header.css
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   ├── Footer.css
│   │   │   └── Layout.jsx           # Page layout wrapper
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Home page
│   │   │   ├── Home.css
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Login.css
│   │   │   ├── Signup.jsx           # Registration page
│   │   │   └── Signup.css
│   │   ├── utils/
│   │   │   ├── api.js               # API client functions
│   │   │   └── constants.js         # App constants
│   │   ├── App.jsx                  # Root component
│   │   ├── App.css
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── vite.config.js               # Vite configuration with proxy
│   └── package.json
│
├── README.md                        # Setup instructions
├── QUICKSTART.md
└── package.json                     # Root package.json
```

---

## **5.3 Database Schema**

### **Customer Model**
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required, unique),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String (default: 'Sri Lanka')
  },
  password: String (required, hashed),
  isAccountVerified: Boolean (default: false),
  verifyOtp: String,
  verifyOtpExpireAt: Number,
  resetOtp: String,
  resetOtpExpireAt: Number,
  cart: [{
    productId: ObjectId (ref: 'Product'),
    quantity: Number,
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### **Admin Model**
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required, unique),
  password: String (required, hashed),
  role: String (default: 'admin', immutable),
  createdAt: Date,
  updatedAt: Date
}
```

### **Product Model**
```javascript
{
  title: String (required, 3-100 chars),
  description: String (required, 10-1000 chars),
  price: Number (required, min: 0),
  image: String (required, path format validation),
  stock: Number (required, integer, min: 0),
  category: String (required, from predefined list),
  createdAt: Date (immutable),
  updatedAt: Date
}
// Compound unique index: title + category
```

### **Order Model**
```javascript
{
  customer: ObjectId (ref: 'Customer', required),
  items: [{
    productId: ObjectId (ref: 'Product'),
    name: String,           // Snapshot at purchase time
    quantity: Number,
    price: Number,          // Unit price snapshot
    subtotal: Number        // price * quantity
  }],
  subTotal: Number,
  tax: Number (default: 0),
  totalAmount: Number,
  status: String (default: 'Pending'),
  createdAt: Date
}
// Valid statuses: Pending, Processing, Shipped, Delivered, Cancelled
```

---

## **5.4 API Endpoints**

### **Authentication Routes** (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Unified login for customer/admin | No |
| POST | `/refresh-token` | Refresh access token | No (uses refresh cookie) |
| POST | `/logout` | Logout user | Yes |

### **Customer Routes** (`/api/customers`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new customer | No |
| GET | `/cart` | Get customer's cart | Yes |
| POST | `/cart/items` | Add item to cart | Yes |
| PUT | `/cart/items/:productId` | Update cart item quantity | Yes |
| DELETE | `/cart/items/:productId` | Remove item from cart | Yes |
| POST | `/orders` | Place order (checkout) | Yes |
| GET | `/orders` | Get order history | Yes |

### **Product Routes** (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all products (with search/pagination) | No |
| POST | `/create` | Create new product | Yes (Admin) |

### **Admin Routes** (`/api/admins`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/customers` | Get all customers | Yes (Admin) |
| GET | `/orders` | Get all orders | Yes (Admin) |
| PUT | `/orders/:orderId` | Update order status | Yes (Admin) |

---

## **5.5 Security Implementation**

### **Authentication**
- JWT-based authentication with separate secrets for admin/customer
- Access token: 15-minute expiry
- Refresh token: 7-day expiry with rotation
- Tokens stored in httpOnly cookies (not accessible via JavaScript)
- SameSite: strict cookie policy

### **Rate Limiting**
| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 attempts | 15 minutes |
| Registration | 3 attempts | 1 hour |

### **Password Security**
- Minimum 12 characters
- Must include: uppercase, lowercase, number, symbol
- Hashed with bcrypt (10 rounds)

### **Input Validation**
- Email validation using validator library
- Phone validation (Sri Lanka format)
- Strong password validation
- Product category validation against predefined list
- File type validation using magic bytes (file-type package)

### **Role-Based Access Control (RBAC)**
- Customer role: Cart, orders, profile access
- Admin role: Product management, order management, customer viewing
- Middleware-based role verification

---

## **5.6 Frontend Features**

### **Pages Implemented**
- **Home Page**: Hero section, category showcase
- **Login Page**: Form validation, error handling, loading states
- **Signup Page**: Form validation, password confirmation

### **Components**
- **Header**: Logo, search bar with category filter, navigation, cart icon with badge, notification bell, profile dropdown with logout
- **Footer**: About section, quick links, contact info
- **Layout**: Wrapper component with Header and Footer

### **Responsive Design**
- Mobile breakpoint: 768px
- Small mobile: 480px
- Dark mode support via CSS media queries
- CSS animations and transitions

### **State Management**
- Auth state via localStorage flag and custom events
- Cart count in Header state
- Form state with controlled inputs

---

# **6. Additional Implemented Features (Not in Original Backlog)**

| Feature | Description | Impact |
|---------|-------------|--------|
| **Refresh Token Rotation** | New refresh token issued on each use | Enhanced security against token theft |
| **httpOnly Cookies** | Tokens stored in secure cookies | Protection against XSS attacks |
| **MongoDB Transactions** | Atomic cart and order operations | Data consistency, prevents overselling |
| **Image Processing Pipeline** | Auto-resize to 800x600, JPEG conversion | Consistent image dimensions, optimized storage |
| **Custom Error Classes** | CartError, StockError, ProductError, etc. | Better error handling and debugging |
| **Centralized Messages** | Constants for all cart/order messages | Consistency, easy maintenance |
| **Cart Auto-Cleanup** | Removes deleted/out-of-stock items from cart | Better user experience |
| **Order Price Snapshots** | Product prices stored at purchase time | Accurate historical records |
| **Tax Calculation** | 8% tax rate with LKR currency | Business logic ready |
| **Database Seeders** | Scripts to populate test data | Easy development and testing |
| **Vite Proxy** | API proxying during development | Seamless development experience |
| **Dark Mode CSS** | Automatic dark mode via prefers-color-scheme | Accessibility feature |

---

# **7. Pending/In-Progress Items**

| Item | Status | Notes |
|------|--------|-------|
| Password Reset | Schema ready | OTP fields in Customer model, API not implemented |
| Email Notifications | Nodemailer installed | Implementation pending |
| Frontend Product Pages | Not started | Products page, product details |
| Frontend Cart Page | Not started | Full cart management UI |
| Frontend Order Pages | Not started | Order history, order details |
| Admin Dashboard | Not started | Admin UI for management |
| Unit Tests | Setup ready | Jest/Supertest configured |
| CSRF Protection | Not implemented | Consider csrf package |
| Update/Delete Products | Not implemented | Admin CRUD completion |

---

# **8. Environment Configuration**

### **Backend (.env)**
```env
HOST=localhost
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce_app

# JWT Secrets
CUSTOMER_JWT_SECRET=your-customer-secret
ADMIN_JWT_SECRET=your-admin-secret
CUSTOMER_REFRESH_JWT_SECRET=your-refresh-secret

# CORS
FRONTEND_URL=http://localhost:5173
```

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000
```

---

# **9. Running the Application**

### **Backend**
```bash
cd backend
npm install
npm run dev        # Development mode with nodemon
npm start          # Production mode
```

### **Frontend**
```bash
cd frontend
npm install
npm run dev        # Development server at :5173
npm run build      # Production build
```

### **Database Seeding**
```bash
cd backend
npm run seed:admin      # Create admin user
npm run seed:customers  # Create test customers
npm run seed:all        # Seed all data
npm run seed:clear      # Clear all data
```

---

*Document Last Updated: December 2024*

