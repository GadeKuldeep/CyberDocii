import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getJourney } from '../api/journeyApi';
import { FaArrowLeft, FaFilter, FaTerminal, FaImage, FaExclamationTriangle, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import '../styles/pages/Journey.css';

const Journey = () => {
    const { projectId } = useParams();
    const [journeyEvents, setJourneyEvents] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchJourney();
    }, [projectId, filter]);

    const fetchJourney = async () => {
        try {
            const { data } = await getJourney(projectId, filter);
            setJourneyEvents(data);
        } catch (error) {
            console.error(error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'command': return <FaTerminal className="icon-command" />;
            case 'error': return <FaExclamationTriangle className="icon-error" />;
            case 'image': return <FaImage className="icon-image" />;
            default: return <FaEdit className="icon-default" />;
        }
    };

    const getActionClass = (action) => {
        switch (action) {
            case 'create': return 'action-create';
            case 'delete': return 'action-delete';
            default: return 'action-update';
        }
    };

    return (
        <div className="journey-layout">
            <Navbar />
            <div className="journey-container">
                <div className="journey-header">
                    <Link to={`/editor/${projectId}`} className="journey-back-link">
                        <FaArrowLeft /> Back to Editor
                    </Link>
                    <h1 className="journey-title">MISSION TIMELINE</h1>
                </div>

                {/* Filter Bar */}
                <div className="filter-bar">
                    {['all', 'command', 'image', 'video', 'error', 'text', 'output'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`filter-btn ${filter === f ? 'active' : 'inactive'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="timeline-wrapper">
                    {journeyEvents.map((event, idx) => (
                        <div key={event._id} className="timeline-event">
                            {/* Dot */}
                            <div className="timeline-dot"></div>

                            <div className="timeline-card">
                                <div className="timeline-header">
                                    <div className="timeline-meta">
                                        <span className={`action-badge ${getActionClass(event.action)}`}>
                                            {event.action}
                                        </span>
                                        <span className="timestamp">
                                            {format(new Date(event.createdAt), 'HH:mm:ss · MMM dd')}
                                        </span>
                                    </div>
                                    <div className="icon-box">
                                        {getIcon(event.type)}
                                    </div>
                                </div>

                                <p className="timeline-details">
                                    {event.details || "No details logged."}
                                </p>
                            </div>
                        </div>
                    ))}

                    {journeyEvents.length === 0 && (
                        <div className="no-events">No timeline events found for this filter.</div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Journey;
