import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ApplicantsTable.css';

const ApplicantsTable = ({ companyId, companyName }) => {
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
    }, [companyId, companyName]);

    // Function to toggle the status of an applicant
    const toggleStatus = async (applicantId, currentStatus) => {
        try {
            // Call API to toggle the status
            await axios.put(`http://localhost:8000/api/applicants/toggle-status/${applicantId}/`);

            // Update the status locally after the API call
            setApplicants((prevApplicants) =>
                prevApplicants.map((applicant) =>
                    applicant.applicant_id === applicantId
                        ? { ...applicant, status: currentStatus === 'selected' ? 'notselected' : 'selected' }
                        : applicant
                )
            );
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    return (
        <div className="applicants-container">
            <h2>Applicants for {companyName}</h2>
            <div className="applicant-cards">
                {applicants.length > 0 ? (
                    applicants.map((applicant) => (
                        <div className="applicant-card" key={applicant.applicant_id}>
                            <div className="card-header">
                                <h3>{applicant.student.name}</h3>
                                <p>{applicant.type === 'Internship' ? applicant.internship.name : applicant.job.name}</p>
                                
                                {/* Toggleable status button */}
                                <button
                                    onClick={() => toggleStatus(applicant.applicant_id, applicant.status)}
                                    className={`status-button ${applicant.status === 'selected' ? 'selected' : 'notselected'}`}
                                >
                                    {applicant.status === 'selected' ? 'Selected' : 'Not Selected'}
                                </button>
                            </div>
                            <div className="card-popup">
                                <p><strong>CGPA:</strong> {applicant.student.cgpa}</p>
                                <p><strong>SRN:</strong> {applicant.student.SRN}</p>
                                <p><strong>Email:</strong> {applicant.student.email}</p>
                                <p><strong>Phone:</strong> {applicant.student.ph_number}</p>
                                <p><strong>Gender:</strong> {applicant.student.gender}</p>
                                <p><strong>Faculty Advisor:</strong> {applicant.student.faculty_advisor}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No applicants found</p>
                )}
            </div>
        </div>
    );
};

export default ApplicantsTable;
