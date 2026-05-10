import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT token
export const generateToken = (userId, email, role) => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
};

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Calculate task statistics
export const calculateTaskStats = (tasks) => {
  const stats = {
    total: tasks.length,
    pending: 0,
    completed: 0,
    overdue: 0,
  };

  const now = new Date();

  tasks.forEach((task) => {
    if (task.status === 'completed') {
      stats.completed++;
    } else if (task.status === 'todo' || task.status === 'in_progress') {
      stats.pending++;
    }

    // Check if overdue
    if (task.due_date && new Date(task.due_date) < now && task.status !== 'completed') {
      stats.overdue++;
    }
  });

  return stats;
};
