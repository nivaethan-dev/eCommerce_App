# E-commerce Application

A full-stack e-commerce application with Express.js backend and Vite + React frontend.

## Project Structure

```
ecommerce_app/
├── backend/          # Express.js API server
│   ├── controllers/  # Route controllers
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   ├── config/       # Configuration files
│   └── server.js     # Server entry point
└── frontend/         # Vite + React application
    ├── src/          # Source files
    │   ├── utils/    # Utility functions (API client)
    │   └── App.jsx   # Main component
    └── vite.config.js # Vite configuration
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or remote connection)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
HOST=localhost
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce_app

# JWT Secrets (change these!)
JWT_ACCESS_SECRET=your-access-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this

# CORS
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Running Both Servers

### Option 1: Use two terminal windows

Terminal 1 (Backend):
```bash
cd backend && npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend && npm run dev
```

### Option 2: Use a process manager like concurrently

You can install concurrently in the root directory and add scripts to manage both servers.

## API Proxy Configuration

The Vite development server is configured to proxy API requests to the backend:

- `/api/*` → `http://localhost:3000/api/*`
- `/uploads/*` → `http://localhost:3000/uploads/*`

This means you can make requests to `/api/products` in your frontend code, and Vite will automatically proxy them to `http://localhost:3000/api/products`.

## Making API Requests

Use the utility functions in `frontend/src/utils/api.js`:

```javascript
import { get, post, put, del } from './utils/api'

// GET request
const products = await get('/api/products')

// POST request
const newProduct = await post('/api/products', { name: 'Product', price: 99 })

// PUT request
const updated = await put('/api/products/123', { name: 'Updated' })

// DELETE request
await del('/api/products/123')
```

## Available API Routes

- `POST /api/auth/login` - Customer/Admin login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

- `GET /api/customers` - Get all customers (admin)
- `POST /api/customers/register` - Register customer
- `GET /api/customers/profile` - Get customer profile

- `GET /api/admins` - Get all admins (admin)
- `POST /api/admins/register` - Register admin

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`. You can serve them with any static file server or integrate them with your backend.

## Technologies Used

### Backend
- Express.js - Web framework
- MongoDB + Mongoose - Database
- JWT - Authentication
- bcryptjs - Password hashing
- Multer + Sharp - Image upload and processing
- CORS - Cross-origin resource sharing

### Frontend
- React 19 - UI library
- Vite - Build tool and dev server
- ES6+ modules - Modern JavaScript

## Development Tips

1. Hot Module Replacement (HMR) is enabled in Vite - your changes will reflect immediately
2. The backend uses nodemon for automatic restarts on file changes
3. All API requests include credentials (cookies) for authentication
4. CORS is configured to allow requests from the Vite dev server

## Troubleshooting

### Backend connection fails
- Make sure MongoDB is running
- Check that the backend is running on port 3000
- Verify the `.env` file is properly configured

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that credentials are being sent with requests

### API requests fail
- Check the browser console and network tab for errors
- Verify the API endpoint exists in the backend routes
- Ensure authentication tokens are valid (if required)

