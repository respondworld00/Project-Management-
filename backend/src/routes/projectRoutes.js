import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
} from '../controllers/projectController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { validateRequest, projectCreateSchema, projectUpdateSchema } from '../validators/schemas.js';

const router = express.Router();

// Protected routes (authenticated users)
router.get('/', authenticateToken, getAllProjects);
router.get('/:projectId', authenticateToken, getProjectById);
router.get('/:projectId/members', authenticateToken, getProjectMembers);

// Admin routes
router.post('/', authenticateToken, authorizeRole('admin'), validateRequest(projectCreateSchema), createProject);
router.put('/:projectId', authenticateToken, authorizeRole('admin'), validateRequest(projectUpdateSchema), updateProject);
router.delete('/:projectId', authenticateToken, authorizeRole('admin'), deleteProject);
router.post('/:projectId/members', authenticateToken, authorizeRole('admin'), addProjectMember);
router.delete('/:projectId/members/:userId', authenticateToken, authorizeRole('admin'), removeProjectMember);

export default router;
