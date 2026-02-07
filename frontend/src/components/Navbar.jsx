import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaSignOutAlt, FaCube } from 'react-icons/fa';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <div className="nav-logo-box">
          <FaCube size={14} />
        </div>
        <span>CYBER<span className="text-primary">DOCII</span></span>
      </Link>
      <div className="nav-links">
        {!user && <Link to="/discovery" className="nav-link">Discover</Link>}
        {user ? (
          <>
            <div className="user-info">
              <span className="user-role">Operator</span>
              <span className="user-name">{user.username || user.email}</span>
            </div>
            <div className="nav-separator"></div>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="login-nav-btn">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
