import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserShield, FaTrash, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './AdminUsers.css';

const AdminUsers = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAuthenticated, user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/users');
      setUsers(response.data.users || []);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    if (!window.confirm(`Change user role to ${newRole.toUpperCase()}?`)) {
      return;
    }

    try {
      setUpdating(userId);
      const response = await axios.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      alert(`User role updated to ${newRole}!`);
    } catch (err) {
      console.error('Error updating user role:', err);
      alert('Failed to update user role');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(userId);
      await axios.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="admin-users-loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <Link to="/admin" className="back-link">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1>Users Management</h1>
        <p>Manage user accounts and roles</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchUsers}>Retry</button>
        </div>
      )}

      <div className="users-stats">
        <div className="stat-box">
          <h3>Total Users</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-box">
          <h3>Admins</h3>
          <p className="stat-number admin">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="stat-box">
          <h3>Customers</h3>
          <p className="stat-number customer">
            {users.filter(u => u.role === 'user' || !u.role).length}
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="no-users">
          <h2>No Users Found</h2>
          <p>Users will appear here when they register.</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userData) => (
                <tr key={userData._id} className={userData._id === user?.id ? 'current-user' : ''}>
                  <td>
                    <div className="user-name">
                      {userData.name}
                      {userData._id === user?.id && <span className="you-badge">You</span>}
                    </div>
                  </td>
                  <td>{userData.email}</td>
                  <td>
                    <span className={`role-badge ${userData.role === 'admin' ? 'admin' : 'user'}`}>
                      {userData.role === 'admin' ? <FaUserShield /> : <FaUser />}
                      {userData.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td>{formatDate(userData.createdAt)}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleRoleChange(userData._id, userData.role)}
                      className={`action-btn role-btn ${userData.role === 'admin' ? 'demote' : 'promote'}`}
                      disabled={updating === userData._id || userData._id === user?.id}
                      title={userData._id === user?.id ? 'Cannot change your own role' : 'Change Role'}
                    >
                      {updating === userData._id ? '...' : (
                        userData.role === 'admin' ? 'Make Customer' : 'Make Admin'
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(userData._id)}
                      className="action-btn delete-btn"
                      disabled={deleteLoading === userData._id || userData._id === user?.id}
                      title={userData._id === user?.id ? 'Cannot delete yourself' : 'Delete User'}
                    >
                      {deleteLoading === userData._id ? '...' : <FaTrash />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;