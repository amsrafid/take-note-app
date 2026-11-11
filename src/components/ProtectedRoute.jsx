import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!token || !user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/notes" replace />;

  return children;
};

export default ProtectedRoute;
