import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyDashboard from './dashboards/company/CompanyDashboards';
import FacultyDashboard from './dashboards/faculty/FacultyDashboard'; 
import StudentDashboard from './dashboards/student/StudentDashboard';


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

    
    return (
        <div className="dashboard-container">
            <h1>Hello, {username}!</h1>

            {/* Conditionally render CompanyDashboard if userType is 'company' */}
            {userType === 'company' ? (
                <CompanyDashboard />
                
 
            ) : (
               <></>
            )}

            {/* Conditionally render CompanyDashboard if userType is 'faculty' */}
            {userType === 'faculty' ? (
                <FacultyDashboard /> 
            ) : (
                <> </>
            )}

            {/* Conditionally render CompanyDashboard if userType is 'company' */}
            {userType === 'student' ? (
                <StudentDashboard /> 
            ) : (
               <></>
            )}

        </div>
    );
};

export default Dashboard;
