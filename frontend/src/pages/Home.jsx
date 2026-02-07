import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaSearch, FaUser, FaProjectDiagram, FaSignInAlt, FaColumns } from 'react-icons/fa';
import '../styles/pages/Home.css';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await getUsers();
                setUsers(data);
            } catch (err) {
                console.error('Failed to fetch users', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="home-container">
            <div className="home-bg-noise"></div>
            <div className="home-glow"></div>

            <header className="home-header">
                <div className="header-content">
                    <h1 className="logo">Cyber<span>Docii</span></h1>
                    <div className="header-actions">
                        {user ? (
                            <>
                                <span className="welcome-name">Hello, {user.username}</span>
                                <Link to="/dashboard" className="btn-login"><FaColumns /> Dashboard</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-login"><FaSignInAlt /> Login</Link>
                                <Link to="/register" className="btn-register">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="home-main">
                <section className="hero-section">
                    <h2>Discover Projects</h2>
                    <p>Browse creators and explore their public technical projects.</p>

                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search creators..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </section>

                <section className="users-section">
                    {loading ? (
                        <div className="loading">Loading creators...</div>
                    ) : (
                        <div className="users-grid">
                            {filteredUsers.map((user) => (
                                <motion.div
                                    key={user._id}
                                    className="user-card"
                                    whileHover={{ y: -5 }}
                                    onClick={() => navigate(`/user/${user._id}`)}
                                >
                                    <div className="user-avatar">
                                        <FaUser />
                                    </div>
                                    <div className="user-info">
                                        <h3>{user.username}</h3>
                                        <p>Developer</p>
                                    </div>
                                    <button className="view-projects-btn">
                                        <FaProjectDiagram /> View Projects
                                    </button>
                                </motion.div>
                            ))}
                            {filteredUsers.length === 0 && !loading && (
                                <div className="no-results">No creators found matching "{searchTerm}"</div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Home;
