import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import request from '../api/client';

const AdminInterestsPage = () => {
  const { token } = useAuth();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    request('/admin/users/grouped-by-interests', { token })
      .then((data) => setGroups(data.data))
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Users Grouped by Interests</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {groups.map((g) => (
        <div key={g.interest} style={{ marginBottom: 12 }}>
          <strong>{g.interest}</strong> ({g.count})
          <ul>
            {g.users.map((u) => <li key={u.id}>{u.name} — {u.email}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminInterestsPage;
