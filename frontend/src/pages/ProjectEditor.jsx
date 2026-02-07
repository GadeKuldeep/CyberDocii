import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BlockEditor from '../components/BlockEditor';
import PdfExportButton from '../components/PdfExportButton';
import { getProjectById } from '../api/projectApi';
import { AuthContext } from '../context/AuthContext';
import { FaArrowLeft, FaHistory } from 'react-icons/fa';
import '../styles/components/Editor.css'; // Reusing the editor CSS

const ProjectEditor = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error("Failed to load project");
      }
    };
    fetchProject();
  }, [id]);

  if (!project) return <div className="text-center mt-20 text-gray-500">Loading protocol...</div>;

  const isOwner = user && project.userId === user._id;
  const backPath = user ? '/dashboard' : '/';

  return (
    <div className="layout-container">
      <Navbar />
      <div className="blocks-container" style={{ padding: '0 1rem' }}>
        <div className="editor-header-bar">
          <div className="editor-header-left">
            <Link to={backPath} className="back-link">
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="project-title-h1">{project.title}</h1>
              <span className="editor-project-id">ID: {project._id} {!isOwner && <span className="view-only-badge">(READ ONLY)</span>}</span>
            </div>

          </div>

          <div className="editor-header-right">
            <PdfExportButton
              projectId={id}
              projectTitle={project.title}
              className="journey-link-btn" // Reusing same style for consistency
            />
            <Link
              to={`/journey/${id}`}
              className="journey-link-btn"
            >
              <FaHistory />
              VIEW JOURNEY
            </Link>
          </div>
        </div>

        <BlockEditor projectId={id} readOnly={!isOwner} />
      </div>
    </div>
  );
};

export default ProjectEditor;
