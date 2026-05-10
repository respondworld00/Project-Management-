import { query } from '../db/pool.js';
import { calculateTaskStats } from '../utils/helpers.js';

// Create task
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, assigned_to, due_date, status } = req.body;
    const userId = req.user.id;

    const result = await query(
      `INSERT INTO tasks (project_id, title, description, assigned_to, due_date, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, project_id, title, description, assigned_to, due_date, status, created_by, created_at`,
      [projectId, title, description || null, assigned_to || null, due_date || null, status || 'todo', userId]
    );

    const task = result.rows[0];
    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all tasks for a project
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await query(
      `SELECT t.id, t.project_id, t.title, t.description, t.status, t.assigned_to, 
              t.due_date, t.created_by, t.created_at, u.name as assigned_to_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.project_id = $1
       ORDER BY t.created_at DESC`,
      [projectId]
    );

    const tasks = result.rows;
    const stats = calculateTaskStats(tasks);

    res.json({
      tasks,
      stats,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const result = await query(
      `SELECT t.id, t.project_id, t.title, t.description, t.status, t.assigned_to, 
              t.due_date, t.created_by, t.created_at, u.name as assigned_to_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = $1 AND t.project_id = $2`,
      [taskId, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update task (Member can update status/assigned_to, Admin can update all)
export const updateTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, assigned_to, due_date, status } = req.body;

    // Get current task
    const currentTask = await query(
      'SELECT * FROM tasks WHERE id = $1 AND project_id = $2',
      [taskId, projectId]
    );

    if (currentTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Determine what can be updated
    let updateFields = [];
    let updateValues = [];
    let paramCount = 1;

    if (req.user.role === 'admin') {
      // Admin can update everything
      if (title !== undefined) {
        updateFields.push(`title = $${paramCount++}`);
        updateValues.push(title);
      }
      if (description !== undefined) {
        updateFields.push(`description = $${paramCount++}`);
        updateValues.push(description);
      }
      if (due_date !== undefined) {
        updateFields.push(`due_date = $${paramCount++}`);
        updateValues.push(due_date);
      }
    }

    // Members and Admins can update status and assigned_to
    if (status !== undefined) {
      updateFields.push(`status = $${paramCount++}`);
      updateValues.push(status);
    }
    if (assigned_to !== undefined) {
      updateFields.push(`assigned_to = $${paramCount++}`);
      updateValues.push(assigned_to);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(taskId);
    updateValues.push(projectId);

    const query_str = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = $${paramCount++} AND project_id = $${paramCount++} RETURNING id, project_id, title, description, status, assigned_to, due_date, created_by, created_at`;

    const result = await query(query_str, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete task (Admin only)
export const deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const result = await query(
      'DELETE FROM tasks WHERE id = $1 AND project_id = $2 RETURNING id, title',
      [taskId, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'Task deleted successfully',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's assigned tasks
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT t.id, t.project_id, t.title, t.description, t.status, t.assigned_to, 
              t.due_date, t.created_by, t.created_at, p.name as project_name
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       WHERE t.assigned_to = $1 OR t.created_by = $1
       ORDER BY t.due_date ASC, t.created_at DESC`,
      [userId]
    );

    const stats = calculateTaskStats(result.rows);

    res.json({
      tasks: result.rows,
      stats,
    });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    let tasksResult;

    if (req.user.role === 'admin') {
      // Admin sees all tasks
      tasksResult = await query('SELECT * FROM tasks');
    } else {
      // Member sees only their assigned/created tasks
      tasksResult = await query(
        'SELECT * FROM tasks WHERE assigned_to = $1 OR created_by = $1',
        [userId]
      );
    }

    const tasks = tasksResult.rows;
    const stats = calculateTaskStats(tasks);

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
