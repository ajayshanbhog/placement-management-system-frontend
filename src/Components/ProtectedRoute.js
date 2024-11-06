// ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// This component checks if the user is authenticated
const ProtectedRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('user'); // Check if a user token or data exists

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default ProtectedRoute;
