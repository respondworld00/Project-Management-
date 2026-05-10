import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { projectAPI, taskAPI, userAPI } from '../utils/api';

export const ProjectDetail = () => {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    status: 'todo',
  });
  const [memberFormData, setMemberFormData] = useState({
    userId: '',
    role: 'member',
  });

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes, membersRes] = await Promise.all([
        projectAPI.getById(projectId),
        taskAPI.getByProject(projectId),
        projectAPI.getMembers(projectId),
      ]);
      setProject(projectRes.data.project);
      setTasks(tasksRes.data.tasks);
      setMembers(membersRes.data.members);
      
      // Fetch all users for the add member dropdown (if admin)
      if (user?.role === 'admin') {
        try {
          const usersRes = await userAPI.getAll();
          setAllUsers(usersRes.data.users);
        } catch (userErr) {
          console.error('Error fetching users:', userErr);
          // Don't fail the whole component if users can't be loaded
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create(projectId, formData);
      setFormData({
        title: '',
        description: '',
        assigned_to: '',
        due_date: '',
        status: 'todo',
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await taskAPI.update(projectId, taskId, updates);
      fetchData();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await taskAPI.delete(projectId, taskId);
        fetchData();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.addMember(projectId, memberFormData);
      setMemberFormData({ userId: '', role: 'member' });
      setShowAddMember(false);
      fetchData();
    } catch (err) {
      setError('Failed to add member to project');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Remove this member from the project?')) {
      try {
        await projectAPI.removeMember(projectId, userId);
        fetchData();
      } catch (err) {
        setError('Failed to remove member');
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {project && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>

          {/* Project Members Section */}
          <div className="mb-8 card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Project Members</h2>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="btn btn-primary"
                >
                  {showAddMember ? '✕ Cancel' : '+ Add Member'}
                </button>
              )}
            </div>

            {showAddMember && (
              <form onSubmit={handleAddMember} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <select
                    className="input"
                    required
                    value={memberFormData.userId}
                    onChange={(e) => setMemberFormData({ ...memberFormData, userId: parseInt(e.target.value) })}
                  >
                    <option value="">Select a user...</option>
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                  <select
                    className="input"
                    value={memberFormData.role}
                    onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Add Member
                </button>
              </form>
            )}

            {members.length === 0 ? (
              <div className="text-gray-500">No members assigned to this project yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Name</th>
                      <th className="border p-3 text-left">Email</th>
                      <th className="border p-3 text-left">Role</th>
                      {user?.role === 'admin' && (
                        <th className="border p-3 text-left">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.user_id} className="hover:bg-gray-50">
                        <td className="border p-3">{member.name}</td>
                        <td className="border p-3">{member.email}</td>
                        <td className="border p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {member.role}
                          </span>
                        </td>
                        {user?.role === 'admin' && (
                          <td className="border p-3">
                            <button
                              onClick={() => handleRemoveMember(member.user_id)}
                              className="btn btn-danger text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Tasks</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
            >
              {showForm ? '✕ Cancel' : '+ Add Task'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleCreateTask} className="card mb-8">
              <input
                type="text"
                placeholder="Task Title"
                className="input mb-4"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="input mb-4 h-20 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <select
                className="input mb-4"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="datetime-local"
                className="input mb-4"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
              <button type="submit" className="btn btn-primary">
                Create Task
              </button>
            </form>
          )}

          {tasks.length === 0 ? (
            <div className="card text-center text-gray-500">
              No tasks yet
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{task.title}</h3>
                      <p className="text-gray-600">{task.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Assigned to</p>
                      <p className="font-medium">{task.assigned_to_name || 'Unassigned'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Due Date</p>
                      <p className="font-medium">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <select
                      className="input text-sm py-1"
                      value={task.status}
                      onChange={(e) => handleUpdateTask(task.id, { status: e.target.value })}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    {user?.role === 'admin' && (
                      <>
                        <button
                          onClick={() => handleUpdateTask(task.id, { status: 'in_progress' })}
                          className="btn btn-secondary text-sm"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="btn btn-danger text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
