import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const userType = localStorage.getItem('userType');
    // Redirect to home if username is not in local storage
    useEffect(() => {
        if (!username) {
            navigate('/');
        }
    }, [username, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('username'); // Clear username from local storage
        localStorage.removeItem('userType'); // Clear userType if stored
        navigate('/login'); // Redirect to the login page
    };

    return (
        <div className="dashboard-container">
            <h1>Hello, {username}!</h1>
            <p>Welcome to PESU PMS!</p>
            <p>Type : {userType}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
