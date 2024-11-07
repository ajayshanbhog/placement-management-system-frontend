import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import CompanyDashboard from './Components/dashboards/CompanyDashboards';
import FacultyDashboard from './Components/dashboards/FacultyDashboard';
import StudentDashboard from './Components/dashboards/StudentDashboard';
import './App.css';

function App() {
    return (
        <Router>
            <Header />
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/company" element={<CompanyDashboard />} />
                    <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
                    <Route path="/dashboard/student" element={<StudentDashboard />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;
