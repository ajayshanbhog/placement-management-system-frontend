import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [userType, setUserType] = useState('faculty');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        ph_number: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    axios.defaults.baseURL = 'http://localhost:8000';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setMessage('');

        let endpoint = '';
        if (userType === 'student') {
            endpoint = '/register/student/';
        } else if (userType === 'faculty') {
            endpoint = '/register/faculty/';
        } else if (userType === 'company') {
            endpoint = '/register/company/';
        }

        try {
            const response = await axios.post(endpoint, {
                name: formData.name,
                email: formData.email,
                ph_number: formData.ph_number,
                password: formData.password,
            });
            setMessage(response.data.message);
            setTimeout(function() {navigate('/login')},1000);
        } catch (error) {
            setMessage(error.response?.data.message || 'Registration Unsuccessful');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <label>User Type</label>
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="company">Company</option>
                </select>

                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Phone Number</label>
                <input type="text" name="ph_number" value={formData.ph_number} onChange={handleChange} />

                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

                <button type="submit">Register</button>
            </form>
            {message && <p className="register-message">{message}</p>}
        </div>
    );
};

export default Register;