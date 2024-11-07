import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentDashboard.css';

// Set the base URL for Axios
axios.defaults.baseURL = 'http://localhost:8000';

const StudentDashboard = () => {
    const [internships, setInternships] = useState([]);
    const [fulltimeJobs, setFulltimeJobs] = useState([]);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await axios.get(`/api/internships/${username}/`);
                setInternships(response.data);
            } catch (error) {
                console.error("Error fetching internships:", error);
            }
        };

        const fetchFulltimeJobs = async () => {
            try {
                const response = await axios.get(`/api/fulltimes/${username}/`);
                setFulltimeJobs(response.data);
            } catch (error) {
                console.error("Error fetching full-time jobs:", error);
            }
        };

        fetchInternships();
        fetchFulltimeJobs();
    }, [username]);

    return (
        <div className="student-dashboard">
            <h1>Student Dashboard</h1>
            <h2>Internship Opportunities</h2>
            <table className="offers-table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Stipend</th>
                        <th>PPO</th>
                        <th>Type</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {internships.length > 0 ? (
                        internships.map(internship => (
                            <tr key={internship.internship_id}>
                                <td>{internship.company_name}</td>
                                <td>{internship.name}</td>
                                <td>{internship.location}</td>
                                <td>{internship.stipend}</td>
                                <td>{internship.ppo ? 'Yes' : 'No'}</td>
                                <td>{internship.type}</td>
                                <td>{internship.duration} months</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No internship opportunities available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h2>Full-Time Employment Opportunities</h2>
            <table className="offers-table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Job Title</th>
                        <th>Location</th>
                        <th>Package</th>
                    </tr>
                </thead>
                <tbody>
                    {fulltimeJobs.length > 0 ? (
                        fulltimeJobs.map(job => (
                            <tr key={job.job_id}>
                                <td>{job.company_name}</td>
                                <td>{job.job_title}</td>
                                <td>{job.location}</td>
                                <td>{job.package}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No full-time employment opportunities available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentDashboard;
