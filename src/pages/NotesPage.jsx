import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import request from '../api/client';

const NotesPage = () => {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    request(`/notes?page=${page}&limit=5`, { token })
      .then((data) => {
        setNotes(data.data);
        setTotalPages(data.totalPages);
      })
      .catch((err) => setError(err.message));
  }, [page, reloadKey, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await request(`/notes/${editingId}`, { method: 'PUT', body: form, token });
      } else {
        await request('/notes', { method: 'POST', body: form, token });
      }
      setForm({ title: '', content: '' });
      setEditingId(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setForm({ title: note.title, content: note.content });
  };

  const handleDelete = async (id) => {
    try {
      await request(`/notes/${id}`, { method: 'DELETE', token });
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>My Notes</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {notes.map((note) => (
          <li key={note._id} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <strong>{note.title}</strong>
            <span>{note.content}</span>
            <span>
              <button onClick={() => handleEdit(note)}>Edit</button>
              <button onClick={() => handleDelete(note._id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>

      <div>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span> Page {page} / {totalPages} </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default NotesPage;
