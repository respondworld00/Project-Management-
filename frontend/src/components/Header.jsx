import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            📋 PMS
          </Link>
          <ul className="flex gap-6">
            <li>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/projects" className="text-gray-700 hover:text-blue-600">
                Projects
              </Link>
            </li>
            {user.role === 'admin' && (
              <li>
                <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user.name}</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {user.role.toUpperCase()}
          </span>
          <button onClick={handleLogout} className="btn btn-secondary text-sm">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};
