import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { validateRequest, userRegistrationSchema, userLoginSchema } from '../validators/schemas.js';

const router = express.Router();

// Public routes
router.post('/register', validateRequest(userRegistrationSchema), register);
router.post('/login', validateRequest(userLoginSchema), login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

// Admin routes
router.get('/', authenticateToken, authorizeRole('admin'), getAllUsers);
router.put('/:userId', authenticateToken, authorizeRole('admin'), updateUser);
router.delete('/:userId', authenticateToken, authorizeRole('admin'), deleteUser);

export default router;
