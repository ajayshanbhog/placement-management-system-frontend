import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

axios.defaults.baseURL = 'http://localhost:8000';

const getApiEndpoint = (userType, userId) => {
    if (userType === 'faculty') return `/get/faculty/${userId}/`;
    if (userType === 'student') return `/get/student/${userId}/`;
    if (userType === 'company') return `/get/company/${userId}/`;
    return null;
};

// Update API Endpoint based on userType
const updateApiEndpoint = (userType, userId) => {
    if (userType === 'faculty') return `/update/faculty/${userId}/`;
    if (userType === 'student') return `/update/student/${userId}/`;
    if (userType === 'company') return `/update/company/${userId}/`;
    return null;
};

// Profile Component
const Profile = () => {
    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId');
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);

    // Fetch profile data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(getApiEndpoint(userType, userId));
                setProfileData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchData();
    }, [userType, userId]);

    // Handle form field changes
    const handleChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission to update profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(updateApiEndpoint(userType, userId), profileData);
            setIsUpdated(true);
            setTimeout(() => setIsUpdated(false), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="profile">
            <div className="profile-container">
                <h2>{userType.charAt(0).toUpperCase() + userType.slice(1)} Profile</h2>
                {isUpdated && <div className="success-message">Profile updated successfully!</div>}
                
                <form onSubmit={handleSubmit}>
                    {/* Faculty Fields */}
                    {userType === 'faculty' && (
                        <>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    name="ph_number"
                                    value={profileData.ph_number || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    {/* Student Fields */}
                    {userType === 'student' && (
                        <>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    name="ph_number"
                                    value={profileData.ph_number || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    {/* Company Fields */}
                    {userType === 'company' && (
                        <>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Location:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={profileData.location || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Type:</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={profileData.type || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
