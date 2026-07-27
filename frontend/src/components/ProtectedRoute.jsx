import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    }

    // 1. If no user is logged in, kick them back to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. If this page requires a specific role (e.g., 'examiner') and the user doesn't have it
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect them to their proper dashboard based on their actual role
        if (user.role === 'candidate') return <Navigate to="/candidate/dashboard" replace />;
        if (user.role === 'examiner' || user.role === 'admin') return <Navigate to="/examiner/dashboard" replace />;
    }

    // 3. If they pass all checks, let them see the page!
    return children;
};

export default ProtectedRoute;