import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import request from '../api/client';

const AdminUsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', interests: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    request(`/admin/users?page=${page}&limit=5`, { token })
      .then((data) => {
        setUsers(data.data);
        setTotalPages(data.totalPages);
      })
      .catch((err) => setError(err.message));
  }, [page, reloadKey, token]);

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: 'user', interests: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const interests = form.interests.split(',').map((s) => s.trim()).filter(Boolean);
      if (editingId) {
        await request(`/admin/users/${editingId}`, {
          method: 'PUT',
          body: { name: form.name, role: form.role, interests },
          token
        });
      } else {
        await request('/admin/users', { method: 'POST', body: { ...form, interests }, token });
      }
      resetForm();
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (u) => {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, interests: (u.interests || []).join(', ') });
  };

  const handleDelete = async (id) => {
    try {
      await request(`/admin/users/${id}`, { method: 'DELETE', token });
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Manage Users</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!!editingId} />
        {!editingId && (
          <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        )}
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <input placeholder="Interests (comma separated)" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
        <button type="submit">{editingId ? 'Update' : 'Add User'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Interests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u._id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{(u.interests || []).join(', ')}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span> Page {page} / {totalPages} </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default AdminUsersPage;
