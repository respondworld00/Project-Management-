# Admin User Management

## Current Admin Users

- **Email**: aadityarana463@gmail.com
- **Role**: admin
- **Promoted**: May 10, 2026

---

## How to Manage Admin Users

### 1. **Make a User Admin (Via Database)**

Run the SQL command directly:

```sql
UPDATE users 
SET role = 'admin', updated_at = CURRENT_TIMESTAMP
WHERE email = 'your-email@example.com';
```

Or use the prepared script:
```bash
psql -U postgres -d project_db -f backend/src/db/admin-setup.sql
```

### 2. **Make a User Admin (Via API)**

**Endpoint**: `PUT /api/users/:userId`

**Requirements**: Admin authentication required

**Request**:
```bash
curl -X PUT http://localhost:5000/api/users/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "role": "admin"
  }'
```

**Response**:
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 2,
    "email": "aadityarana463@gmail.com",
    "name": "User Name",
    "role": "admin"
  }
}
```

### 3. **View All Users**

**Endpoint**: `GET /api/users`

**Requirements**: Admin authentication required

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 4. **Demote Admin to Member**

```sql
UPDATE users 
SET role = 'member', updated_at = CURRENT_TIMESTAMP
WHERE email = 'email@example.com';
```

---

## Admin Permissions

Users with `role = 'admin'` can:

✅ View all users (`GET /api/users`)  
✅ Update user roles (`PUT /api/users/:userId`)  
✅ Delete users (`DELETE /api/users/:userId`)  
✅ Create projects (`POST /api/projects`)  
✅ Manage all projects  
✅ Access admin panel in frontend  

---

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Roles**:
- `admin` - Full system access
- `member` - Limited access to assigned projects

---

## API Authentication

All admin endpoints require a valid JWT token:

```bash
# 1. Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aadityarana463@gmail.com",
    "password": "your-password"
  }'

# 2. Use the returned token in Authorization header
-H "Authorization: Bearer <token>"
```

---

## Quick Reference

| Action | Method | Endpoint | Requirements |
|--------|--------|----------|--------------|
| Get all users | GET | `/api/users` | Admin role |
| Update user role | PUT | `/api/users/:userId` | Admin role |
| Delete user | DELETE | `/api/users/:userId` | Admin role |
| Current user info | GET | `/api/users/me` | Authenticated |

