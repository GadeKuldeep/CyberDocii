import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjects } from '../api/projectApi';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaProjectDiagram, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import '../styles/pages/UserProjects.css';

const UserProjects = () => {
    const { userId } = useParams();
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await getProjects(userId);
                setProjects(data);
            } catch (err) {
                console.error('Failed to fetch projects', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [userId]);

    return (
        <div className="user-projects-container">
            <div className="up-bg-noise"></div>
            <div className="up-glow"></div>

            <header className="up-header">
                <div className="up-header-content">
                    <button className="back-btn" onClick={() => navigate(user ? '/dashboard' : '/')}>
                        <FaArrowLeft /> {user ? 'Back to Dashboard' : 'Back to Discovery'}
                    </button>
                    <h1 className="logo">Cyber<span>Docii</span></h1>
                </div>
            </header>

            <main className="up-main">
                <section className="profile-hero">
                    <div className="profile-info">
                        <h2>User Projects</h2>
                        <p>Browsing technical documentation created by this user.</p>
                    </div>
                </section>

                <section className="projects-section">
                    {loading ? (
                        <div className="loading">Loading projects...</div>
                    ) : (
                        <div className="projects-list">
                            {projects.map((project) => (
                                <motion.div
                                    key={project._id}
                                    className="project-row"
                                    whileHover={{ x: 10 }}
                                    onClick={() => navigate(`/editor/${project._id}`)}
                                >
                                    <div className="project-icon">
                                        <FaProjectDiagram />
                                    </div>
                                    <div className="project-name">
                                        <h3>{project.title}</h3>
                                        <div className="project-meta">
                                            <span><FaCalendarAlt /> Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                                            <span className="status-badge">{project.status}</span>
                                        </div>
                                    </div>
                                    <div className="project-arrow">
                                        <FaChevronRight />
                                    </div>
                                </motion.div>
                            ))}
                            {projects.length === 0 && !loading && (
                                <div className="no-projects">This user hasn't published any projects yet.</div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default UserProjects;
