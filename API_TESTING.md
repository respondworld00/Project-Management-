# API Testing Guide

Complete guide for testing all API endpoints of the Project Management System.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-domain.com/api`

## Test Data

Create test accounts first:

### Admin Account
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "password123"
  }'
```

### Member Account
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Member User",
    "email": "member@test.com",
    "password": "password123"
  }'
```

## Authentication Endpoints

### 1. Register User

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

**Response (201 Created)**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "member"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login User

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

**Response (200 OK)**:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "member"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get Current User

```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200 OK)**:
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "member"
  }
}
```

## User Management Endpoints (Admin Only)

### 4. Get All Users

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response (200 OK)**:
```json
{
  "users": [
    {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "member",
      "created_at": "2024-05-10T10:00:00Z"
    }
  ]
}
```

### 5. Update User Role

```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

**Response (200 OK)**:
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
```

### 6. Delete User

```bash
curl -X DELETE http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response (200 OK)**:
```json
{
  "message": "User deleted successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

## Project Endpoints

### 7. Create Project (Admin Only)

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign",
    "description": "Complete redesign of company website"
  }'
```

**Response (201 Created)**:
```json
{
  "message": "Project created successfully",
  "project": {
    "id": 1,
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "created_by": 1,
    "created_at": "2024-05-10T10:00:00Z"
  }
}
```

### 8. Get All Projects

```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK)**:
```json
{
  "projects": [
    {
      "id": 1,
      "name": "Website Redesign",
      "description": "Complete redesign of company website",
      "created_by": 1,
      "created_at": "2024-05-10T10:00:00Z"
    }
  ]
}
```

### 9. Get Project by ID

```bash
curl -X GET http://localhost:5000/api/projects/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK)**:
```json
{
  "project": {
    "id": 1,
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "created_by": 1,
    "created_at": "2024-05-10T10:00:00Z"
  }
}
```

### 10. Update Project (Admin Only)

```bash
curl -X PUT http://localhost:5000/api/projects/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign - Phase 2",
    "description": "Second phase of website redesign"
  }'
```

**Response (200 OK)**:
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": 1,
    "name": "Website Redesign - Phase 2",
    "description": "Second phase of website redesign",
    "created_by": 1,
    "created_at": "2024-05-10T10:00:00Z"
  }
}
```

### 11. Delete Project (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/projects/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response (200 OK)**:
```json
{
  "message": "Project deleted successfully",
  "project": {
    "id": 1,
    "name": "Website Redesign"
  }
}
```

## Project Members Endpoints

### 12. Get Project Members

```bash
curl -X GET http://localhost:5000/api/projects/1/members \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK)**:
```json
{
  "members": [
    {
      "user_id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "admin"
    },
    {
      "user_id": 2,
      "email": "jane@example.com",
      "name": "Jane Smith",
      "role": "member"
    }
  ]
}
```

### 13. Add Project Member (Admin Only)

```bash
curl -X POST http://localhost:5000/api/projects/1/members \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "role": "member"
  }'
```

**Response (201 Created)**:
```json
{
  "message": "Member added to project",
  "member": {
    "project_id": 1,
    "user_id": 2,
    "role": "member"
  }
}
```

### 14. Remove Project Member (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/projects/1/members/2 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response (200 OK)**:
```json
{
  "message": "Member removed from project",
  "member": {
    "project_id": 1,
    "user_id": 2
  }
}
```

## Task Endpoints

### 15. Create Task

```bash
curl -X POST http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Homepage",
    "description": "Create mockups for new homepage",
    "assigned_to": 2,
    "due_date": "2024-06-01T17:00:00",
    "status": "todo"
  }'
```

**Response (201 Created)**:
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "project_id": 1,
    "title": "Design Homepage",
    "description": "Create mockups for new homepage",
    "status": "todo",
    "assigned_to": 2,
    "due_date": "2024-06-01T17:00:00Z",
    "created_by": 1,
    "created_at": "2024-05-10T10:00:00Z"
  }
}
```

### 16. Get Project Tasks

```bash
curl -X GET http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK)**:
```json
{
  "tasks": [
    {
      "id": 1,
      "project_id": 1,
      "title": "Design Homepage",
      "description": "Create mockups for new homepage",
      "status": "todo",
      "assigned_to": 2,
      "due_date": "2024-06-01T17:00:00Z",
      "created_by": 1,
      "created_at": "2024-05-10T10:00:00Z",
      "assigned_to_name": "Jane Smith"
    }
  ],
  "stats": {
    "total": 1,
    "pending": 1,
    "completed": 0,
    "overdue": 0
  }
}
```

### 17. Get Task by ID

```bash
curl -X GET http://localhost:5000/api/tasks/1/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK)**:
```json
{
  "task": {
    "id": 1,
    "project_id": 1,
    "title": "Design Homepage",
    "description": "Create mockups for new homepage",
    "status": "todo",
    "assigned_to": 2,
    "due_date": "2024-06-01T17:00:00Z",
    "created_by": 1,
    "created_at": "2024-05-10T10:00:00Z",
    "assigned_to_name": "Jane Smith"
  }
}
```

### 18. Update Task

**Member can update**: status, assigned_to
**Admin can update**: title, description, status, assigned_to, due_date

```bash
curl -X PUT http://localhost:5000/api/tasks/1/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

**Response (200 OK)**:
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "project_id": 1,
    "title": "Design Homepage",
    "description": "Create mockups for new homepage",
    "status": "in_progress",
    "assigned_to": 2,
    "due_date": "2024-06-01T17:00:00Z",
    "created_by": 1,
    "created_at": "2024-05-10T10:00:00Z"
  }
}
```

### 19. Delete Task (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/tasks/1/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response (200 OK)**:
```json
{
  "message": "Task deleted successfully",
  "task": {
    "id": 1,
    "title": "Design Homepage"
  }
}
```

## Dashboard Endpoints

### 20. Get User Tasks

```bash
curl -X GET http://localhost:5000/api/tasks/user/assigned \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK)**:
```json
{
  "tasks": [...],
  "stats": {
    "total": 5,
    "pending": 2,
    "completed": 3,
    "overdue": 0
  }
}
```

### 21. Get Dashboard Stats

```bash
curl -X GET http://localhost:5000/api/tasks/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK)**:
```json
{
  "stats": {
    "total": 10,
    "pending": 4,
    "completed": 5,
    "overdue": 1
  }
}
```

## Health Check

### 22. Health Check (No auth required)

```bash
curl -X GET http://localhost:5000/health
```

**Response (200 OK)**:
```json
{
  "status": "Server is running"
}
```

## Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email format"
    }
  ]
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

### 409 Conflict
```json
{
  "error": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Testing Workflow

### Complete Test Flow

```bash
# 1. Register admin user
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"pass123"}')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.token')

# 2. Create project
PROJECT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"Testing"}')

PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.project.id')

# 3. Create task
curl -s -X POST http://localhost:5000/api/tasks/$PROJECT_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test Task",
    "description":"Testing task creation",
    "status":"todo"
  }' | jq

# 4. Get dashboard stats
curl -s -X GET http://localhost:5000/api/tasks/dashboard/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq
```

## Postman Collection

You can import these endpoints into Postman for easier testing. Create a collection with:

1. Create `Bearer Token` authentication type
2. Add {{base_url}} variable = http://localhost:5000/api
3. Add {{token}} variable from login response
4. Create folders for each endpoint category

---

**Happy testing! 🧪**
