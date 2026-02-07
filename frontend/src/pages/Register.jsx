import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import '../styles/pages/Register.css';
import '../styles/pages/Login.css'; // Reuse common styles

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await register({ username, email, password });
      loginUser(data);
      navigate('/');
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || 'Registration failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-noise"></div>
      <div className="register-glow"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="login-card"
      >
        <div className="login-header">
          <h2 className="login-title">Initialize Account</h2>
          <p className="login-subtitle">Create your operator identity.</p>
        </div>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Codename</label>
            <input
              type="text"
              placeholder="Neo"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="neo@cyberdocii.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Establishing Link...' : 'Establish Link'}
          </button>
        </form>
        <div className="login-footer">
          <Link to="/login" className="login-link">Already registered? <span>Login</span></Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
