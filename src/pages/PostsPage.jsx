import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import request from '../api/client';

const PostsPage = () => {
  const { token, user } = useAuth();
  const [form, setForm] = useState({ title: '', content: '' });
  const [createError, setCreateError] = useState('');
  const [users, setUsers] = useState([]);
  const [lookupId, setLookupId] = useState('');
  const [result, setResult] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const userId = user && user.id;

  useEffect(() => {
    request('/users', { token })
      .then((data) => {
        setUsers(data.data);
        setLookupId((data.data.find((u) => u._id === userId) || data.data[0] || {})._id || '');
      })
      .catch(() => setUsers([]));
  }, [token, userId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    try {
      await request('/posts', { method: 'POST', body: form, token });
      setForm({ title: '', content: '' });
    } catch (err) {
      setCreateError(err.message);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    setLookupError('');
    try {
      const data = await request(`/posts/user/${lookupId}`, { token });
      setResult(data);
    } catch (err) {
      setLookupError(err.message);
      setResult(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Write a Post</h2>
      <form onSubmit={handleCreate}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <button type="submit">Create Post</button>
      </form>
      {createError && <p style={{ color: 'red' }}>{createError}</p>}

      <h2>View a User's Posts</h2>
      <form onSubmit={handleLookup}>
        <select value={lookupId} onChange={(e) => setLookupId(e.target.value)}>
          {users.map((u) => (
            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
          ))}
        </select>
        <button type="submit" disabled={!lookupId}>Lookup</button>
      </form>
      {lookupError && <p style={{ color: 'red' }}>{lookupError}</p>}
      {result && (
        <div>
          <p>{result.name} ({result.email})</p>
          <ul>
            {result.posts.map((p) => <li key={p._id}>{p.title}: {p.content}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
