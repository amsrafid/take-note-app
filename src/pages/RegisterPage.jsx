import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import request from '../api/client';
import { useAuth } from '../context/useAuth';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await request('/auth/register', {
        method: 'POST',
        body: {
          name: form.name,
          email: form.email,
          password: form.password,
          interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean)
        }
      });
      login(data.token, data.user);
      navigate('/notes');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />
        <input name="interests" placeholder="Interests (comma separated)" value={form.interests} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Already have account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default RegisterPage;
