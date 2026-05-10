# Project Index & Quick Reference

Complete index of all files, documentation, and resources in the Project Management System.

## 📖 Documentation Files (Start Here!)

### Primary Documentation
- **[README.md](README.md)** - Complete project documentation, API reference, architecture
- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes (Docker or local)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Step-by-step Railway deployment guide
- **[PROJECT_COMPLETION.md](PROJECT_COMPLETION.md)** - Project summary and feature list

### Reference Guides
- **[API_TESTING.md](API_TESTING.md)** - API endpoints with curl examples and testing workflow
- **[ENVIRONMENT_CONFIG.md](ENVIRONMENT_CONFIG.md)** - Complete environment variables reference

---

## 🗂️ Backend Structure

### Entry Point
```
backend/src/server.js - Express app initialization
```

### Controllers (Business Logic)
```
backend/src/controllers/
├── userController.js      - Auth, user management
├── projectController.js   - Project CRUD, members
└── taskController.js      - Task CRUD, stats
```

### Routes (API Endpoints)
```
backend/src/routes/
├── userRoutes.js      - /api/users endpoints
├── projectRoutes.js   - /api/projects endpoints
└── taskRoutes.js      - /api/tasks endpoints
```

### Middleware
```
backend/src/middleware/
└── auth.js - JWT verification, RBAC, role checking
```

### Database
```
backend/src/db/
├── pool.js        - PostgreSQL connection management
└── schema.sql     - Database schema initialization
```

### Utilities
```
backend/src/utils/
├── helpers.js       - JWT generation, password hashing, stats calculation
└── errorHandler.js  - Error middleware and handling
```

### Validation
```
backend/src/validators/
└── schemas.js - Zod validation schemas for all endpoints
```

### Configuration Files
```
backend/
├── package.json         - Dependencies
├── .env.example         - Environment template
├── .gitignore          - Git ignore rules
├── Dockerfile          - Production container
├── railway.json        - Railway deployment config
└── README.md           - Backend-specific docs
```

---

## 🗂️ Frontend Structure

### Entry Points
```
frontend/
├── index.html        - HTML template
├── src/main.jsx      - React entry point
└── src/App.jsx       - Main app component
```

### Pages (Full-page Components)
```
frontend/src/pages/
├── Login.jsx         - Login form (public)
├── Register.jsx      - Registration form (public)
├── Dashboard.jsx     - Task statistics and overview
├── Projects.jsx      - List and create projects
├── ProjectDetail.jsx - View project tasks
└── Admin.jsx         - User and project management (admin only)
```

### Components (Reusable)
```
frontend/src/components/
├── Header.jsx            - Navigation header
└── ProtectedRoute.jsx    - Route protection wrapper
```

### State Management
```
frontend/src/context/
└── AuthContext.jsx - Authentication state and providers
```

### Utilities
```
frontend/src/utils/
├── api.js         - API endpoint wrappers
└── axiosConfig.js - Axios interceptors and configuration
```

### Styling
```
frontend/src/styles/
└── index.css - Tailwind CSS imports and custom styles
```

### Configuration Files
```
frontend/
├── package.json          - Dependencies
├── .env.example          - Environment template
├── .gitignore           - Git ignore rules
├── index.html           - HTML template
├── vite.config.js       - Vite build configuration
├── tailwind.config.js   - Tailwind CSS configuration
├── postcss.config.js    - PostCSS configuration
├── Dockerfile           - Production build
├── Dockerfile.dev       - Development container
└── README.md            - Frontend-specific docs
```

---

## 🐳 Docker & Deployment

### Docker Files
```
backend/Dockerfile       - Production Node.js image
frontend/Dockerfile     - Production build and serve
frontend/Dockerfile.dev - Development with hot reload

docker-compose.yml      - Local development orchestration
```

### Configuration
```
backend/railway.json    - Railway deployment configuration
```

---

## 📊 Database

### Schema Location
```
backend/src/db/schema.sql
```

### Tables
1. **users** - User accounts and roles
2. **projects** - Project definitions
3. **project_members** - User-Project relationships
4. **tasks** - Project tasks with status tracking

### Migrations
- Initial schema: `backend/src/db/schema.sql`
- Run in PostgreSQL or auto-run in Docker

---

## 🔗 API Endpoints

### User Endpoints (3)
```
POST   /api/users/register          - Register new user
POST   /api/users/login             - Login user
GET    /api/users/me                - Get current user
GET    /api/users                   - List all users (Admin)
PUT    /api/users/:id               - Update user role (Admin)
DELETE /api/users/:id               - Delete user (Admin)
```

### Project Endpoints (8)
```
GET    /api/projects                - List projects
POST   /api/projects                - Create project (Admin)
GET    /api/projects/:id            - Get project details
PUT    /api/projects/:id            - Update project (Admin)
DELETE /api/projects/:id            - Delete project (Admin)
GET    /api/projects/:id/members    - List project members
POST   /api/projects/:id/members    - Add member (Admin)
DELETE /api/projects/:id/members/:uid - Remove member (Admin)
```

### Task Endpoints (7)
```
POST   /api/tasks/:pid              - Create task
GET    /api/tasks/:pid              - List project tasks
GET    /api/tasks/:pid/:id          - Get task details
PUT    /api/tasks/:pid/:id          - Update task
DELETE /api/tasks/:pid/:id          - Delete task (Admin)
GET    /api/tasks/user/assigned     - Get user's tasks
GET    /api/tasks/dashboard/stats   - Get dashboard statistics
```

### Health Check (1)
```
GET    /health                      - Health check (no auth)
```

**Total: 26 Endpoints**

---

## 🔒 RBAC Implementation

### Middleware Files
- `backend/src/middleware/auth.js` - All auth middleware

### Key Functions
1. **authenticateToken** - Verify JWT token
2. **authorizeRole** - Check exact role
3. **authorizeRoles** - Check multiple roles
4. **checkProjectAccess** - Check project membership

### Roles
- **Admin**: Full system access
- **Member**: Limited access (view assigned projects, update own tasks)

---

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@host/dbname
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

See: `ENVIRONMENT_CONFIG.md` for complete reference

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
VITE_DEBUG=false
```

---

## 🛠️ Development Commands

### Backend
```bash
cd backend
npm install              # Install dependencies
npm run dev              # Start with auto-reload (nodemon)
npm start                # Production start
npm test                 # Run tests
```

### Frontend
```bash
cd frontend
npm install              # Install dependencies
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Docker
```bash
docker-compose up       # Start all services
docker-compose down     # Stop all services
docker-compose logs     # View logs
docker-compose ps       # List containers
```

---

## 📚 Additional Resources

### Quick Links
- API Testing: `API_TESTING.md` (curl examples)
- Setup Guide: `QUICKSTART.md` (5-minute setup)
- Deployment: `DEPLOYMENT.md` (Railway step-by-step)
- Configuration: `ENVIRONMENT_CONFIG.md` (All env vars)
- Project Summary: `PROJECT_COMPLETION.md` (Feature list)

### Code Examples
- Backend routes: `backend/src/routes/`
- Frontend pages: `frontend/src/pages/`
- API client: `frontend/src/utils/api.js`
- Validation: `backend/src/validators/schemas.js`

---

## 🔍 File Navigation

### By Purpose

#### Authentication
- `backend/src/middleware/auth.js`
- `backend/src/controllers/userController.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Register.jsx`

#### Project Management
- `backend/src/controllers/projectController.js`
- `backend/src/routes/projectRoutes.js`
- `frontend/src/pages/Projects.jsx`
- `frontend/src/pages/ProjectDetail.jsx`

#### Task Management
- `backend/src/controllers/taskController.js`
- `backend/src/routes/taskRoutes.js`
- `frontend/src/pages/ProjectDetail.jsx`

#### Admin Panel
- `backend/src/controllers/userController.js`
- `frontend/src/pages/Admin.jsx`

#### Database
- `backend/src/db/schema.sql`
- `backend/src/db/pool.js`

#### API Integration
- `frontend/src/utils/api.js`
- `frontend/src/utils/axiosConfig.js`

---

## 📋 Checklist for New Developers

- [ ] Read `README.md` for overview
- [ ] Follow `QUICKSTART.md` to set up locally
- [ ] Review `API_TESTING.md` to understand endpoints
- [ ] Explore `backend/src/controllers/` for business logic
- [ ] Check `frontend/src/pages/` for UI components
- [ ] Study `ENVIRONMENT_CONFIG.md` for configuration
- [ ] Review `backend/src/middleware/auth.js` for RBAC
- [ ] Test with `docker-compose up`
- [ ] Follow `DEPLOYMENT.md` for production

---

## 🎯 Common Tasks

### Add New API Endpoint
1. Create controller method in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Add validation in `backend/src/validators/schemas.js`
4. Test with curl (see `API_TESTING.md`)

### Add New Frontend Page
1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `frontend/src/components/Header.jsx`
4. Integrate API calls from `frontend/src/utils/api.js`

### Change Database Schema
1. Modify `backend/src/db/schema.sql`
2. Delete and recreate database (dev only)
3. Update models and queries

### Deploy to Production
1. Follow `DEPLOYMENT.md`
2. Set environment variables in Railway
3. Connect GitHub repository
4. Monitor logs and metrics

---

## 🔗 File Dependencies

### Backend Chain
```
server.js
├── routes/userRoutes.js
│   ├── controllers/userController.js
│   │   ├── db/pool.js
│   │   └── utils/helpers.js
│   └── middleware/auth.js
├── routes/projectRoutes.js
│   ├── controllers/projectController.js
│   │   └── db/pool.js
│   └── middleware/auth.js
└── routes/taskRoutes.js
    ├── controllers/taskController.js
    │   ├── db/pool.js
    │   └── utils/helpers.js
    └── middleware/auth.js
```

### Frontend Chain
```
App.jsx
├── AuthContext.jsx
├── Header.jsx
├── Pages (Login, Dashboard, etc.)
├── utils/api.js
├── utils/axiosConfig.js
└── styles/index.css
```

---

## 📞 Support Resources

| Need | Resource |
|------|----------|
| Setup help | QUICKSTART.md |
| API reference | API_TESTING.md |
| Configuration | ENVIRONMENT_CONFIG.md |
| Deployment | DEPLOYMENT.md |
| Full docs | README.md |
| Project overview | PROJECT_COMPLETION.md |

---

## 🚀 Getting Started Path

1. **Read**: `README.md` (5 min)
2. **Setup**: Follow `QUICKSTART.md` (5 min)
3. **Test**: Use `API_TESTING.md` (10 min)
4. **Explore**: Review code structure (20 min)
5. **Deploy**: Follow `DEPLOYMENT.md` (30 min)

**Total Time: ~70 minutes to full deployment**

---

## 💡 Pro Tips

### For Developers
- Use `docker-compose` for consistent environment
- Check logs with `npm run dev` and `docker-compose logs`
- Test APIs with curl examples from `API_TESTING.md`
- Keep `.env` files in `.gitignore`

### For DevOps
- Use Railway for automatic CI/CD
- Enable PostgreSQL automated backups
- Monitor resource usage in Railway dashboard
- Set up custom domain for production

### For Deployment
- Generate strong `JWT_SECRET` before deploying
- Always use HTTPS in production
- Keep database backups
- Monitor error logs regularly

---

**Last Updated: May 10, 2026**
**Project Status: ✅ Complete and Ready for Deployment**

---

For questions, refer to the comprehensive documentation included with this project!
