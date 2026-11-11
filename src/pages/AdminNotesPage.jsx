import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import request from '../api/client';

const AdminNotesPage = () => {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    request(`/admin/notes?page=${page}&limit=5`, { token })
      .then((data) => {
        setNotes(data.data);
        setTotalPages(data.totalPages);
      })
      .catch((err) => setError(err.message));
  }, [page, token]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Everyone's Notes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {notes.map((note) => (
          <li key={note._id} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <strong>{note.title}</strong>
            <span>{note.content}</span>
            <span>by {note.owner ? `${note.owner.name} (${note.owner.email})` : 'Unknown'}</span>
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

export default AdminNotesPage;
