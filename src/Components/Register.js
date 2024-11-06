import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [userType, setUserType] = useState('faculty');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        srn: '',
        branch: '',
        dob: '',
        ph_number: '',
        gender: 'Other',
        cgpa: '',
        faculty_advisor: '',
        user_id: '',
        staff_id: '',
        department: '',
        type: '',
        designation_role: '',
        location: '',
        package: '',
    });
    const [message, setMessage] = useState('');

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

        if (formData.cgpa < 6.75 ) {
            setMessage("You are not Eligble for Placement");
            return;
        }

        setMessage('');

        
        let data = {};
        let endpoint = '';


        if (userType === 'student') {
            endpoint = '/register/student/';
            data = {
                name: formData.name,
                SRN: formData.srn,
                branch: formData.branch,
                dob: formData.dob,
                email: formData.email,
                ph_number: formData.ph_number,
                gender: formData.gender,
                cgpa: formData.cgpa,
                faculty_advisor: formData.faculty_advisor,
                user_id: formData.user_id,
                password: formData.password
            };
        } else if (userType === 'faculty') {
            endpoint = '/register/faculty/';
            data = {
                role: formData.designation_role,
                staff_id: formData.staff_id,
                user_id: formData.user_id,
                password: formData.password,
                name: formData.name,
                email: formData.email,
                ph_number: formData.ph_number,
                department: formData.department
            };
        } else if (userType === 'company') {
            endpoint = '/register/company/';
            data = {
                name: formData.name,
                type: formData.type,
                designation_role: formData.designation_role,
                location: formData.location,
                package: formData.package,
                user_id: formData.user_id,
                password: formData.password
            };
        }

        try {
            const response = await axios.post(endpoint, data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data.message || 'Registration Unsuccessful Connection');
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

                {userType === 'student' && (
                    <>
                        <label>SRN</label>
                        <input type="text" name="srn" value={formData.srn} onChange={handleChange} required />

                        <label>Branch</label>
                        <input type="text" name="branch" value={formData.branch} onChange={handleChange} />

                        <label>Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

                        <label>Phone Number</label>
                        <input type="text" name="ph_number" value={formData.ph_number} onChange={handleChange} />

                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <label>CGPA</label>
                        <input type="number" name="cgpa" step="0.01" max="10" value={formData.cgpa} onChange={handleChange} />

                        <label>Faculty Advisor</label>
                        <input type="text" name="faculty_advisor" value={formData.faculty_advisor} onChange={handleChange} />
                    </>
                )}

                {userType === 'faculty' && (
                    <>
                        <label>Staff ID</label>
                        <input type="text" name="staff_id" value={formData.staff_id} onChange={handleChange} required />

                        <label>Phone Number</label>
                        <input type="text" name="ph_number" value={formData.ph_number} onChange={handleChange} />

                        <label>Department</label>
                        <input type="text" name="department" value={formData.department} onChange={handleChange} />
                    </>
                )}

                {userType === 'company' && (
                    <>
                        <label>Type</label>
                        <input type="text" name="type" value={formData.type} onChange={handleChange} />

                        <label>Designation Role</label>
                        <input type="text" name="designation_role" value={formData.designation_role} onChange={handleChange} />

                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} />

                        <label>Package</label>
                        <input type="number" name="package" step="0.01" value={formData.package} onChange={handleChange} />
                    </>
                )}

                <label>User ID</label>
                <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} required />

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
