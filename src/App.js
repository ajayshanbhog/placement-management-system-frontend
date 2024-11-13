import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import Profile from './Components/Profile';
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
                    <Route path="/dashboard/profileUpdate" element={<Profile />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;
