import { query } from '../db/pool.js';

// Create project (Admin only)
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const result = await query(
      'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING id, name, description, created_by, created_at',
      [name, description || null, userId]
    );

    const project = result.rows[0];

    // Add creator as admin member
    await query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
      [project.id, userId, 'admin']
    );

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    let queryText = `
      SELECT DISTINCT p.id, p.name, p.description, p.created_by, p.created_at
      FROM projects p
    `;
    const params = [];

    if (req.user.role !== 'admin') {
      queryText += `
        WHERE p.created_by = $1 OR p.id IN (
          SELECT project_id FROM project_members WHERE user_id = $2
        )
      `;
      params.push(userId, userId);
    }

    queryText += ' ORDER BY p.created_at DESC';

    const result = await query(queryText, params);
    res.json({ projects: result.rows });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await query(
      'SELECT id, name, description, created_by, created_at FROM projects WHERE id = $1',
      [projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update project (Admin only)
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const result = await query(
      'UPDATE projects SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, description, created_by, created_at',
      [name || null, description || null, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete project (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await query('DELETE FROM projects WHERE id = $1 RETURNING id, name', [projectId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      message: 'Project deleted successfully',
      project: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add member to project (Admin only)
export const addProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (project_id, user_id) DO UPDATE SET role = $3 RETURNING project_id, user_id, role',
      [projectId, userId, role]
    );

    res.status(201).json({
      message: 'Member added to project',
      member: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding project member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get project members
export const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await query(
      `SELECT pm.user_id, u.email, u.name, pm.role 
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = $1
       ORDER BY pm.role DESC`,
      [projectId]
    );

    res.json({ members: result.rows });
  } catch (error) {
    console.error('Error fetching project members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove project member (Admin only)
export const removeProjectMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const result = await query(
      'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING project_id, user_id',
      [projectId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found in project' });
    }

    res.json({
      message: 'Member removed from project',
      member: result.rows[0],
    });
  } catch (error) {
    console.error('Error removing project member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
