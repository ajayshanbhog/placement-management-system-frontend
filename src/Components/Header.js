import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('username'); // Clear username from local storage
        localStorage.removeItem('userType'); // Clear userType if stored
        localStorage.removeItem('facultyUserId');
        localStorage.removeItem('StudentCGPA');
        navigate('/login'); // Redirect to the login page
    };

    return (
        <header className="header">
            <h1>PMS</h1>
            <nav>
                {isAuthenticated ? (
                    <>
                    <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                    <button onClick={() => navigate('/')}>Home</button>
                    <button onClick={handleLogout}>Logout</button>
                    
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/')}>Home</button>
                        <button onClick={() => navigate('/login')}>Login</button>
                        <button onClick={() => navigate('/register')}>Register</button>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
