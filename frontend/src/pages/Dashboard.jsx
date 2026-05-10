import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { taskAPI } from '../utils/api';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await taskAPI.getDashboardStats();
      setStats(res.data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Total Tasks</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats.total}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
          <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.completed}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Overdue</h3>
          <p className="text-4xl font-bold text-red-600 mt-2">{stats.overdue}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Welcome {user?.name}!</h2>
        <p className="text-gray-600 mb-4">
          You are logged in as a <strong>{user?.role}</strong> user.
        </p>
        {user?.role === 'admin' && (
          <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
            As an admin, you can create projects, manage users, and delete tasks.
          </div>
        )}
        {user?.role === 'member' && (
          <div className="bg-green-50 p-4 rounded-lg text-green-800">
            As a member, you can view assigned projects and update task status.
          </div>
        )}
      </div>
    </div>
  );
};
