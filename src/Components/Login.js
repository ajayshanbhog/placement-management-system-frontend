import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [userType, setUserType] = useState('faculty');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [srn, setSrn] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    axios.defaults.baseURL = 'http://localhost:8000';

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        let loginData = { password };
        let endpoint = '';

        if (userType === 'faculty') {
            endpoint = '/login/faculty';
            loginData = { email, password };
        } else if (userType === 'company') {
            endpoint = '/login/company';
            loginData = { name: email, password };
        } else if (userType === 'student') {
            endpoint = '/login/student';
            loginData = { SRN: srn, password };
        }

        try {
            const response = await axios.post(endpoint, loginData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage(response.data.message);

            // Store the username and userType in localStorage
            localStorage.setItem('username', userType === 'student' ? srn : email);
            localStorage.setItem('userType', userType);

            if (userType === 'faculty' && response.data.user_id) {
                localStorage.setItem('facultyUserId', response.data.user_id); // Store user_id for faculty
            }

            if (userType === 'company' && response.data.user_id) {
                localStorage.setItem('CompanyId', response.data.user_id); 
            }

            if (userType === 'student') {
                localStorage.setItem('StudentCGPA', response.data.student_cgpa); // Store CGPA
                localStorage.setItem('StudentId', response.data.student_id);
            }

            navigate('/dashboard'); // Redirect to the dashboard
        } catch (error) {   
            setMessage(error.response?.data.message || 'Login Unsuccessful');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>User Type</label>
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                    <option value="faculty">Faculty</option>
                    <option value="company">Company</option>
                    <option value="student">Student</option>
                </select>

                {userType === 'student' ? (
                    <>
                        <label>SRN</label>
                        <input
                            type="text"
                            value={srn}
                            onChange={(e) => setSrn(e.target.value)}
                            placeholder="Enter SRN"
                            required
                        />
                    </>
                ) : (
                    <>
                        <label>{userType === 'company' ? 'Company Name' : 'Email'}</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={`Enter ${userType === 'company' ? 'Company Name' : 'Email'}`}
                            required
                        />
                    </>
                )}

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    required
                />

                <button type="submit">Login</button>
            </form>
            {message && <p className="login-message">{message}</p>}
        </div>
    );
};

export default Login;
