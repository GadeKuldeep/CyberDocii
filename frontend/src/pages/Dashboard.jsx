import React, { useEffect, useState, useContext } from 'react';
import { getProjects, createProject, deleteProject } from '../api/projectApi';
import { getUsers } from '../api/authApi';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { FaPlus, FaTrash, FaFolderOpen, FaClock, FaSearch, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import PdfExportButton from '../components/PdfExportButton';
import '../styles/pages/Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('my-projects');
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchAllUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await getUsers();
      setAllUsers(data);
    } catch (error) {
      console.error("Failed to fetch users");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProject({ title: newProjectTitle });
      setNewProjectTitle('');
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Failed to create project");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error("Failed to delete project");
      }
    }
  };

  const filteredUsers = allUsers.filter(u =>
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'my-projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-projects')}
          >
            My Projects
          </button>
          <button
            className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            Explore Creators
          </button>
        </div>

        {activeTab === 'my-projects' ? (
          <div className="tab-panel">
            <div className="dashboard-header">
              <div className="dashboard-title-area">
                <h1>Projects</h1>
                <p className="dashboard-subtitle">Manage your cybersecurity documentation.</p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="new-project-btn"
              >
                <FaPlus /> NEW PROJECT
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="empty-state">
                <p>No operations found.</p>
                <button onClick={() => setShowModal(true)} className="empty-state-btn">Start a new operation</button>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="project-card"
                  >
                    <div className="delete-btn-wrapper">
                      <button onClick={() => handleDelete(project._id)} className="delete-btn">
                        <FaTrash />
                      </button>
                    </div>
                    <div className="card-body">
                      <div className="project-icon-wrapper">
                        <FaFolderOpen size={24} />
                      </div>
                      <Link to={`/editor/${project._id}`} className="project-link">
                        <h3 className="project-title">{project.title}</h3>
                      </Link>
                      <p className="project-id">{project._id}</p>
                    </div>


                    <div className="project-footer">
                      <span className="project-date"><FaClock size={12} /> {format(new Date(project.updatedAt), 'MMM dd, yyyy')}</span>
                      <div className="footer-actions">
                        <PdfExportButton
                          projectId={project._id}
                          projectTitle={project.title}
                          className="card-pdf-btn"
                        />
                        <span className="project-status">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="tab-panel">
            <div className="explore-header-dashboard">
              <h2>Discovery Hub</h2>
              <div className="dashboard-search">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search creators..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="explore-grid-dashboard">
              {filteredUsers.map(u => (
                <motion.div
                  key={u._id}
                  className="creator-card"
                  whileHover={{ y: -3 }}
                  onClick={() => navigate(`/user/${u._id}`)}
                >
                  <div className="creator-avatar">
                    <FaUser />
                  </div>
                  <div className="creator-info">
                    <h3>{u.username}</h3>
                    <p>Technician</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>

      {showModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-content"
          >
            <h2 className="modal-title">Initialize Project</h2>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                className="modal-input"
                placeholder="Project Title (e.g., Red Team Assessment 01)"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="create-btn">Create</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
