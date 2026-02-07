import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import '../styles/pages/NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">Sector Not Found</h2>
            <p className="not-found-text">
                The coordinates you are trying to access do not exist in the current grid.
            </p>
            <Link to="/" className="return-home-btn">
                <FaHome /> Return to Base
            </Link>
        </div>
    );
};

export default NotFound;
