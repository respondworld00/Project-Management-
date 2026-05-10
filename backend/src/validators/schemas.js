import { z } from 'zod';

// User Validation Schemas
export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Project Validation Schemas
export const projectCreateSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255),
  description: z.string().optional(),
});

export const projectUpdateSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255).optional(),
  description: z.string().optional(),
});

// Task Validation Schemas
export const taskCreateSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(255),
  description: z.string().optional(),
  assigned_to: z.number().optional().nullable(),
  due_date: z.string().datetime().optional().nullable(),
  status: z.enum(['todo', 'in_progress', 'completed']).default('todo'),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(255).optional(),
  description: z.string().optional(),
  assigned_to: z.number().optional().nullable(),
  due_date: z.string().datetime().optional().nullable(),
  status: z.enum(['todo', 'in_progress', 'completed']).optional(),
});

// Middleware to validate request body
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      }
      res.status(400).json({ error: 'Invalid request' });
    }
  };
};
