# Project Management System

A full-stack Project Management Web App with role-based access control (RBAC), real-time task tracking, and project collaboration features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Admin Management](#admin-management)
- [Deployment to Railway](#deployment-to-railway)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Production Build](#production-build)

## ✨ Features

### Core Features
- **User Authentication**: JWT-based authentication with secure password hashing
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Can create projects, manage users, delete tasks, view all projects
  - **Member**: Can view assigned projects, update task status, view assigned tasks
- **Project Management**: Create, read, update, and delete projects
- **Task Management**: Create, assign, and track tasks with status updates
- **Dashboard**: Real-time statistics showing:
  - Total tasks
  - Pending tasks
  - Completed tasks
  - Overdue tasks

### Database Features
- PostgreSQL relational database with optimized indexes
- Referential integrity with CASCADE deletes
- User-Project-Task relationships

### API Features
- RESTful endpoints with proper HTTP verbs
- Input validation using Zod
- Protected routes with JWT middleware
- CORS support for frontend integration
- Comprehensive error handling

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router v6** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Input validation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Local orchestration
- **Railway** - Cloud deployment

## 📁 Project Structure

```
project-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── userController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── userRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── validators/
│   │   │   └── schemas.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── db/
│   │   │   ├── pool.js
│   │   │   └── schema.sql
│   │   └── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   └── Admin.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── .gitignore
├── docker-compose.yml
└── README.md
```

## 📋 Prerequisites

### For Local Development
- Node.js 18+ and npm
- PostgreSQL 12+ (or Docker)
- Git

### For Docker Setup
- Docker Desktop installed and running

### For Railway Deployment
- Railway account (https://railway.app)
- Git repository (GitHub, GitLab, etc.)

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd project-management-system
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/project_management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Install dependencies:

```bash
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Database Setup (Without Docker)

Create a PostgreSQL database and run the schema:

```bash
psql -U postgres -d project_management -f ../backend/src/db/schema.sql
```

Or use psql interactive:

```bash
psql -U postgres
CREATE DATABASE project_management;
\c project_management
\i ../backend/src/db/schema.sql
```

### 5. Start Development Servers

#### Backend (in backend directory):
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

#### Frontend (in frontend directory, in another terminal):
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🐳 Docker Setup

### Using Docker Compose (Recommended for Local Development)

```bash
# From project root
docker-compose up
```

This will:
- Start PostgreSQL database
- Create the database schema
- Start the backend server on port 5000
- Start the frontend dev server on port 5173

Access the application at `http://localhost:5173`

### Stop Services

```bash
docker-compose down
```

### Remove Volumes (Clean slate)

```bash
docker-compose down -v
```

## 📊 Database Setup

### Schema Overview

#### Users Table
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- password (hashed)
- name
- role (admin, member)
- created_at, updated_at
```

#### Projects Table
```sql
- id (PRIMARY KEY)
- name
- description
- created_by (FOREIGN KEY -> users)
- created_at, updated_at
```

#### Project Members Table
```sql
- id (PRIMARY KEY)
- project_id (FOREIGN KEY -> projects)
- user_id (FOREIGN KEY -> users)
- role (admin, member)
```

#### Tasks Table
```sql
- id (PRIMARY KEY)
- project_id (FOREIGN KEY -> projects)
- title
- description
- status (todo, in_progress, completed)
- assigned_to (FOREIGN KEY -> users)
- due_date
- created_by (FOREIGN KEY -> users)
- created_at, updated_at
```

## 📡 API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

### Authentication
All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### User Endpoints

#### Register
```
POST /users/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
Response: { user, token }
```

#### Login
```
POST /users/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
Response: { user, token }
```

#### Get Current User
```
GET /users/me
Authorization: Bearer <token>
Response: { user }
```

#### Get All Users (Admin only)
```
GET /users
Authorization: Bearer <token>
```

#### Update User Role (Admin only)
```
PUT /users/:userId
Body: { "role": "admin" | "member" }
```

#### Delete User (Admin only)
```
DELETE /users/:userId
```

### Project Endpoints

#### Get All Projects
```
GET /projects
Authorization: Bearer <token>
```

#### Create Project (Admin only)
```
POST /projects
Body: {
  "name": "Project Name",
  "description": "Project Description"
}
```

#### Get Project by ID
```
GET /projects/:projectId
```

#### Update Project (Admin only)
```
PUT /projects/:projectId
Body: {
  "name": "New Name",
  "description": "New Description"
}
```

#### Delete Project (Admin only)
```
DELETE /projects/:projectId
```

#### Get Project Members
```
GET /projects/:projectId/members
```

#### Add Project Member (Admin only)
```
POST /projects/:projectId/members
Body: {
  "userId": 1,
  "role": "admin" | "member"
}
```

#### Remove Project Member (Admin only)
```
DELETE /projects/:projectId/members/:userId
```

### Task Endpoints

#### Get Project Tasks
```
GET /tasks/:projectId
Response: {
  "tasks": [...],
  "stats": { "total": 5, "pending": 2, "completed": 2, "overdue": 1 }
}
```

#### Create Task
```
POST /tasks/:projectId
Body: {
  "title": "Task Title",
  "description": "Task Description",
  "assigned_to": 1,
  "due_date": "2024-12-31T10:00:00",
  "status": "todo"
}
```

#### Update Task
```
PUT /tasks/:projectId/:taskId
Body: {
  "status": "in_progress",
  "assigned_to": 2
}
```

#### Delete Task (Admin only)
```
DELETE /tasks/:projectId/:taskId
```

#### Get User Tasks
```
GET /tasks/user/assigned
Response: {
  "tasks": [...],
  "stats": { ... }
}
```

#### Get Dashboard Stats
```
GET /tasks/dashboard/stats
Response: {
  "stats": {
    "total": 10,
    "pending": 3,
    "completed": 5,
    "overdue": 2
  }
}
```

## � Admin Management

### Current Admins
- **aadityarana463@gmail.com** - Admin user

### Managing Admin Users

See [ADMIN_MANAGEMENT.md](./ADMIN_MANAGEMENT.md) for detailed instructions on:
- Promoting users to admin via API or database
- Viewing all users
- Updating user roles
- Demoting admin users back to members

### Quick Admin Commands

**Promote a user to admin (SQL)**:
```bash
psql -U postgres -d project_db -f backend/src/db/admin-setup.sql
```

**Promote a user via API**:
```bash
curl -X PUT http://localhost:5000/api/users/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"role": "admin"}'
```

## �🚀 Deployment to Railway

### Step 1: Prepare Your Repository

Ensure your project is pushed to GitHub:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Create Railway Account

1. Visit https://railway.app
2. Sign up with GitHub
3. Create a new project

### Step 3: Deploy Backend

1. In Railway Dashboard, click "New Project"
2. Select "Deploy from GitHub"
3. Choose your repository
4. Configure the service:
   - Root Directory: `backend`
   - Dockerfile: Select `Dockerfile`

### Step 4: Add PostgreSQL Database

1. Click "Add" in the Railway project
2. Select "PostgreSQL"
3. Railway will automatically configure the `DATABASE_URL`

### Step 5: Set Environment Variables

In Railway dashboard for the backend service, add:

```
JWT_SECRET=your_secure_random_secret_here
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=5000
```

Railway will auto-provide:
- `DATABASE_URL` (from PostgreSQL service)

### Step 6: Deploy Frontend

1. Create a new Railway service for the frontend
2. Select "Deploy from GitHub"
3. Configure:
   - Root Directory: `frontend`
   - Dockerfile: Select `Dockerfile`

### Step 7: Get Your URLs

Railway will assign public URLs to both services:
- Backend: `https://your-backend.up.railway.app`
- Frontend: `https://your-frontend.up.railway.app`

### Step 8: Update Frontend CORS

Update the backend's `CORS_ORIGIN` environment variable to match your frontend URL.

### Step 9: Testing

1. Visit your frontend URL
2. Register a new account
3. Create a project
4. Add tasks and test functionality

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRATION=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (vite.config.js or .env)

```env
VITE_API_URL=http://localhost:5000
```

## 💻 Development

### Backend Development

```bash
cd backend
npm run dev
```

Uses `nodemon` for automatic restart on file changes.

### Frontend Development

```bash
cd frontend
npm run dev
```

Vite provides hot module replacement (HMR).

### Running Tests (Backend)

```bash
npm test
```

## 📦 Production Build

### Build Frontend

```bash
cd frontend
npm run build
```

Creates optimized build in `dist/` folder.

### Build Backend Docker Image

```bash
cd backend
docker build -t project-management-backend:latest .
```

### Run Production Backend

```bash
docker run -p 5000:5000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=your_secret \
  project-management-backend:latest
```

## 🔑 Key Features Implementation

### RBAC Middleware

Located in `backend/src/middleware/auth.js`:

```javascript
// Only Admin can access
authorizeRole('admin')

// Admin or Member can access
authorizeRoles('admin', 'member')

// Check project access
checkProjectAccess
```

### Input Validation

Using Zod schemas in `backend/src/validators/schemas.js`:

- Email validation
- Password requirements (min 6 characters)
- Empty task prevention
- Date validation

### Dashboard Statistics

Calculated in `backend/src/utils/helpers.js`:

```javascript
- Total tasks
- Pending (todo + in_progress not overdue)
- Completed
- Overdue (due_date < now && status != completed)
```

## 📝 API Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [...]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. admin role required"
}
```

### 404 Not Found
```json
{
  "error": "Project not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with meaningful messages
4. Push to your fork
5. Create a Pull Request

## 📄 License

MIT License - feel free to use this project for educational and commercial purposes.

## 🆘 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check `DATABASE_URL` is correct
- Verify database exists

### CORS Error
- Update `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL matches exactly

### JWT Token Invalid
- Verify `JWT_SECRET` matches on backend
- Check token hasn't expired

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ | Project Management System v1.0.0**
