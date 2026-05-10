# Quick Start Guide

Get the Project Management System running in 5 minutes!

## Option 1: Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd project-management-system

# 2. Start all services
docker-compose up

# 3. Initialize database (first time only)
# The database is initialized automatically, but if needed:
docker exec project_management_db psql -U postgres -d project_management -f /docker-entrypoint-initdb.d/schema.sql

# 4. Open your browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# Health check: http://localhost:5000/health
```

### First User Setup

```
1. Visit http://localhost:5173
2. Click "Sign up"
3. Register with any email/password
4. First user will have access to features
5. For admin access, run (optional):
   docker exec project_management_db psql -U postgres -d project_management
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Stop Services

```bash
docker-compose down
```

## Option 2: Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+ (running locally)

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your database credentials
DATABASE_URL=postgresql://postgres@localhost:5432/project_management

# 4. Install dependencies
npm install

# 5. Initialize database (one-time)
psql -U postgres -d project_management -f src/db/schema.sql

# 6. Start development server
npm run dev
# Backend runs on http://localhost:5000
```

### Frontend Setup (in a new terminal)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Copy environment file
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

## Test the Application

### 1. Register Account
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
# Save the token from response
```

### 3. Get Current User
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create a Project (Admin only)
```bash
# Make sure user has admin role first
curl -X POST http://localhost:5000/api/users/YOUR_USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"role": "admin"}'

# Then create project
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My First Project",
    "description": "A test project"
  }'
```

### 5. UI Testing

1. Open http://localhost:5173 in browser
2. Sign up with test credentials
3. Navigate to Dashboard - see task statistics
4. Go to Projects - view/create projects
5. If admin - visit Admin panel for user management

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Kill process on port 5173
lsof -i :5173
kill -9 <PID>
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# If not running, start PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: services.msc -> Start PostgreSQL
```

### Schema Not Initialized

```bash
# Manually run schema
cd backend
psql -U postgres -d project_management -f src/db/schema.sql
```

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables Reference

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/project_management
JWT_SECRET=your_jwt_secret_change_this
JWT_EXPIRATION=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Project Structure Quick Reference

```
backend/
  └── src/
      ├── controllers/    # Business logic
      ├── routes/        # API endpoints
      ├── middleware/    # Auth, validation
      ├── db/           # Database connection
      └── server.js     # Entry point

frontend/
  └── src/
      ├── pages/        # Page components
      ├── components/   # Reusable components
      ├── context/      # Auth context
      ├── utils/        # API client
      └── App.jsx       # Main component
```

## Key Features to Test

- **Authentication**: Register, login, logout
- **Projects**: Create, view, edit, delete
- **Tasks**: Create, update status, delete
- **Dashboard**: View task statistics
- **Admin Panel**: Manage users and projects
- **Role-Based Access**: Admin vs Member permissions

## Next Steps

1. **Customize**: Modify colors in `tailwind.config.js`
2. **Add Features**: Extend API endpoints as needed
3. **Deploy**: Follow DEPLOYMENT.md for Railway setup
4. **Database**: Add more indexes for optimization
5. **Testing**: Add unit tests and integration tests

## API Documentation

For complete API documentation, see `README.md` section "API Documentation"

## Performance Tips

1. **Backend**: Use `npm run dev` for development with auto-reload
2. **Frontend**: Vite provides instant HMR (Hot Module Replacement)
3. **Database**: Already has optimized indexes
4. **Caching**: Consider adding Redis for production

## Common Tasks

### Add a New API Endpoint

1. Create controller in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Import and use in `server.js`
4. Test with curl or Postman

### Add a New Frontend Page

1. Create component in `frontend/src/pages/`
2. Add route in `App.jsx`
3. Link from navigation in `Header.jsx`

### Change Database Schema

1. Modify `backend/src/db/schema.sql`
2. Drop and recreate database (development only)
3. Test with seed data

## Support & Issues

- Check logs: `docker-compose logs backend` or `npm run dev` output
- Review API responses in browser DevTools Network tab
- Check database directly: `psql -U postgres -d project_management`

## Production Deployment

For production deployment to Railway, see `DEPLOYMENT.md`

---

**Happy building! 🚀**
