import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectEditor from './pages/ProjectEditor';
import Journey from './pages/Journey';
import NotFound from './pages/NotFound';

import Home from './pages/Home';
import UserProjects from './pages/UserProjects';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/discovery" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
      <Route path="/user/:userId" element={<UserProjects />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Editor and Journey are now public-viewer compatible */}
      <Route path="/editor/:id" element={<ProjectEditor />} />
      <Route path="/journey/:projectId" element={<Journey />} />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
