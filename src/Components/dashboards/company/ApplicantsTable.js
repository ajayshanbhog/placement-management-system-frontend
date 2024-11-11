import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ApplicantsTable.css';

const ApplicantsTable = ({ companyId,companyName }) => {
    const [applicants, setApplicants] = useState([]);
    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/applicants/company/${companyId}/`);
                setApplicants(response.data);
            } catch (error) {
                console.error("Error fetching applicants:", error);
            }
        };

        fetchApplicants();
    }, [companyId,companyName]);

    return (
        <div className="applicants-table">
            <h2>List of Applicants for Company {companyName}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>CGPA</th>
                        <th>SRN</th>
                        <th>Email</th>
                        <th>Internship/Job</th>
                        <th>Application Type</th>
                        <th>Faculty Advisor</th>
                    </tr>
                </thead>
                <tbody>
                    {applicants.length > 0 ? (
                        applicants.map((applicant) => (
                            <tr key={applicant.applicant_id}>                
                                <td>{applicant.student.name}</td>
                                <td>{applicant.student.cgpa}</td>
                                <td>{applicant.student.SRN}</td>
                                <td>{applicant.student.email}</td>
                                <td>{applicant.type === 'Internship' ? applicant.internship.name : applicant.job.name}</td>
                                <td>{applicant.type}</td>
                                <td>{applicant.student.faculty_advisor}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No applicants found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicantsTable;
