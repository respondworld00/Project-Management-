import jwt from 'jsonwebtoken';
import { query } from '../db/pool.js';

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check user role (Admin only)
export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ 
        error: `Access denied. ${role} role required` 
      });
    }
    next();
  };
};

// Middleware to check if user is Admin or Member
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }
    next();
  };
};

// Middleware to check if user is in project
export const checkProjectAccess = async (req, res, next) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    const result = await query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (result.rows.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have access to this project' });
    }

    req.projectRole = result.rows[0]?.role || 'admin';
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

export default {
  authenticateToken,
  authorizeRole,
  authorizeRoles,
  checkProjectAccess,
};
