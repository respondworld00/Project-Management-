import express from 'express';
import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getUserTasks,
  getDashboardStats,
} from '../controllers/taskController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { validateRequest, taskCreateSchema, taskUpdateSchema } from '../validators/schemas.js';

const router = express.Router();

// Protected routes
router.get('/dashboard/stats', authenticateToken, getDashboardStats);
router.get('/user/assigned', authenticateToken, getUserTasks);

// Project tasks
router.get('/:projectId', authenticateToken, getProjectTasks);
router.get('/:projectId/:taskId', authenticateToken, getTaskById);

// Create task (any authenticated user)
router.post('/:projectId', authenticateToken, validateRequest(taskCreateSchema), createTask);

// Update task (members can update status, admin can update all)
router.put('/:projectId/:taskId', authenticateToken, validateRequest(taskUpdateSchema), updateTask);

// Delete task (admin only)
router.delete('/:projectId/:taskId', authenticateToken, authorizeRole('admin'), deleteTask);

export default router;
