import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentDashboard.css';
import RoundsStudentsTable from './RoundsStudentsTable';

axios.defaults.baseURL = 'http://localhost:8000';

const StudentDashboard = () => {
    const [internships, setInternships] = useState([]);
    const [fulltimeJobs, setFulltimeJobs] = useState([]);
    const [appliedInternships, setAppliedInternships] = useState(new Set()); // Track applied internships
    const [appliedFulltimeJobs, setAppliedFulltimeJobs] = useState(new Set()); // Track applied full-time jobs
    const username = localStorage.getItem('username');
    const student_id = localStorage.getItem('StudentId');
    const user_id = localStorage.getItem('userId');

    // Fetch internships and full-time jobs
    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await axios.get(`/api/internships/${username}/`);
                setInternships(response.data);

                // Check if the student has already applied to any internships
                response.data.forEach(internship => {
                    checkApplicationStatus(student_id, internship.internship_id, null);
                });
            } catch (error) {
                console.error("Error fetching internships:", error);
            }
        };

        // Function to check application status
        const checkApplicationStatus = async (student_id, internshipId, jobId) => {
            const params = new URLSearchParams();
            params.append('student_id', student_id);
            
            if (internshipId) {
                params.append('internship_id', internshipId);
            } else if (jobId) {
                params.append('job_id', jobId);
            }

            try {
                const response = await axios.get(`/api/check_application_status/`, { params });
                const status = response.data.status; // 'Applied' or 'Not Applied'

                // Update appliedInternships or appliedFulltimeJobs based on the status
                if (internshipId) {
                    if (status === "Applied") {
                        setAppliedInternships(prev => new Set(prev.add(internshipId)));
                    }
                } else if (jobId) {
                    if (status === "Applied") {
                        setAppliedFulltimeJobs(prev => new Set(prev.add(jobId)));
                    }
                }
            } catch (error) {
                console.error('Error checking application status:', error);
            }
        };

        const fetchFulltimeJobs = async () => {
            try {
                const response = await axios.get(`/api/fulltimes/${username}/`);
                setFulltimeJobs(response.data);

                // Check if the student has already applied to any full-time jobs
                response.data.forEach(job => {
                    checkApplicationStatus(student_id, null, job.job_id);
                });
            } catch (error) {
                console.error("Error fetching full-time jobs:", error);
            }
        };

        fetchInternships();
        fetchFulltimeJobs();
    }, [username,student_id]);

    const handleApply = async (type, id) => {
        const confirmApply = window.confirm("Are you sure you want to apply?");
        if (!confirmApply) return;

        try {
            const response = await axios.post(`/api/apply/`, {
                username,
                type,
                id
            });
            alert(response.data.message);
            if (response.data.status === "success") {
                if (type === "Internship") {
                    setInternships(prev => prev.map(i => i.internship_id === id ? { ...i, applied: true } : i));
                    setAppliedInternships(prev => new Set(prev.add(id))); // Update applied status
                } else if (type === "FullTime") {
                    setFulltimeJobs(prev => prev.map(j => j.job_id === id ? { ...j, applied: true } : j));
                    setAppliedFulltimeJobs(prev => new Set(prev.add(id))); // Update applied status
                }
            }
        } catch (error) {
            console.error("Error applying:", error);
        }
    };

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
                        <th>Apply</th>
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
                                <td>
                                    {appliedInternships.has(internship.internship_id) ? (
                                        "Applied"
                                    ) : (
                                        <button onClick={() => handleApply("Internship", internship.internship_id)}>Apply</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No internship opportunities available</td>
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
                        <th>Apply</th>
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
                                <td>
                                    {appliedFulltimeJobs.has(job.job_id) ? (
                                        "Applied"
                                    ) : (
                                        <button onClick={() => handleApply("FullTime", job.job_id)}>Apply</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No full-time employment opportunities available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div>
            <h1>Rounds</h1>
            <RoundsStudentsTable studentId={user_id} />
            </div>

        </div>
    );
};

export default StudentDashboard;
