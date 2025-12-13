# Quick Start Guide

## First Time Setup

1. **Install all dependencies** (from project root):
```bash
npm run install:all
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. **Configure Backend Environment**:
   - Copy `backend/.env.example` to `backend/.env`
   - Update the values (especially JWT secrets and MongoDB URI)

3. **Configure Frontend Environment**:
   - Copy `frontend/.env.example` to `frontend/.env`
   - Update `VITE_API_URL` if your backend runs on a different port

4. **Start MongoDB** (if running locally):
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

## Running the Application

### Method 1: Two Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server will start on http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Vite dev server will start on http://localhost:5173

### Method 2: Using Root Scripts

From the project root:
```bash
# Backend in one terminal
npm run dev:backend

# Frontend in another terminal
npm run dev:frontend
```

## Verify the Setup

1. Open your browser to http://localhost:5173
2. You should see the React app with a "Backend Status" indicator
3. If backend is connected, it will show "✅ Backend Connected"
4. If not connected, check:
   - Backend is running on port 3000
   - MongoDB is running and accessible
   - No CORS errors in browser console

## Testing the API

You can test the API directly using curl:

```bash
# Test backend health
curl http://localhost:3000/api/products

# Or from the Vite proxy
curl http://localhost:5173/api/products
```

## Common Issues

### Port Already in Use
```bash
# Find process using port 3000 (backend)
lsof -ti:3000

# Kill it if needed
kill -9 $(lsof -ti:3000)

# For frontend (port 5173)
kill -9 $(lsof -ti:5173)
```

### MongoDB Connection Issues
- Check MongoDB is running: `mongosh` or `mongo`
- Verify connection string in `backend/.env`
- Check MongoDB logs

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` is `http://localhost:5173`
- Check browser console for specific errors
- Verify backend CORS middleware is configured

## Next Steps

1. **Seed Database** (optional):
```bash
cd backend
npm run seed:all
```

2. **Create Components**: Add your React components in `frontend/src/components/`

3. **Add Routes**: Define new API routes in `backend/routes/`

4. **Style**: Customize `frontend/src/App.css` and `frontend/src/index.css`

## Useful Commands

```bash
# Backend
npm run dev              # Start with nodemon (auto-reload)
npm start                # Start production server
npm run seed:admin       # Seed admin user
npm run seed:customers   # Seed customer data
npm run seed:all         # Seed all data
npm run seed:reset       # Reset database

# Frontend  
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Root
npm run install:all      # Install all dependencies
npm run dev:backend      # Start backend
npm run dev:frontend     # Start frontend
npm run build:frontend   # Build frontend
```

## Development Workflow

1. Make changes to backend code → Nodemon auto-restarts server
2. Make changes to frontend code → Vite HMR updates browser instantly
3. API requests from frontend → Automatically proxied to backend
4. Cookies/credentials → Automatically included in requests



