import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RoundsStudentsTable.css';

axios.defaults.baseURL = 'http://localhost:8000';

const RoundsStudentsTable = ({ studentId }) => {
    const [internshipRounds, setInternshipRounds] = useState([]);
    const [jobRounds, setJobRounds] = useState([]);

    useEffect(() => {
        const fetchRounds = async () => {
            try {
                const [internshipRes, jobRes] = await Promise.all([
                    axios.get(`/api/internship_rounds/${studentId}/`),
                    axios.get(`/api/fulltime_rounds/${studentId}/`),
                ]);
                setInternshipRounds(internshipRes.data);
                setJobRounds(jobRes.data);
            } catch (error) {
                console.error('Error fetching round data:', error);
            }
        };

        if (studentId) {
            fetchRounds();
        }
    }, [studentId]);

    return (
        <div className="rounds-students-table">
            <h2>Internship Rounds</h2>
            <table className="rounds-table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Internship Name</th>
                        <th>Round No</th>
                        <th>Round Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {internshipRounds.map((round) => (
                        <tr key={round.round_id}>
                            <td>{round.company_name}</td>
                            <td>{round.internship_name}</td>
                            <td>{round.round_no}</td>
                            <td>{round.round_name}</td>
                            <td>{round.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Full-Time Job Rounds</h2>
            <table className="rounds-table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Job Title</th>
                        <th>Round No</th>
                        <th>Round Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {jobRounds.map((round) => (
                        <tr key={round.round_id}>
                            <td>{round.company_name}</td>
                            <td>{round.job_name}</td>
                            <td>{round.round_no}</td>
                            <td>{round.round_name}</td>
                            <td>{round.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoundsStudentsTable;
