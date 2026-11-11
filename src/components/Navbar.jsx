import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ccc', alignItems: 'center' }}>
      <Link to="/notes">My Notes</Link>
      <Link to="/posts">Posts</Link>
      {user.role === 'admin' && (
        <>
          <Link to="/admin/users">Manage Users</Link>
          <Link to="/admin/notes">All Notes</Link>
          <Link to="/admin/interests">Grouped by Interests</Link>
        </>
      )}
      <span style={{ marginLeft: 'auto' }}>{user.name} ({user.role})</span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
