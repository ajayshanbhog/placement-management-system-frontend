// FacultyDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FacultyDashboard.css';
import ResultTable from './ResultTable';

const FacultyDashboard = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const facultyUserId = localStorage.getItem('facultyUserId');  // Get faculty ID from local storage
    axios.defaults.baseURL = 'http://localhost:8000';
    
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`api/students/${facultyUserId}/`);
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [facultyUserId]);

    if (loading) return <p>Loading students...</p>;

    return (
        <div className="faculty-dashboard">
            
            
            
            <h2>List of Mentee</h2>
            <div className="students-container">
                {students.length > 0 ? (
                    students.map(student => (
                        <div key={student.student_id} className="student-card">
                            <h3>{student.name}</h3>
                            <p><strong>SRN:</strong> {student.SRN}</p>
                            <p><strong>Branch:</strong> {student.branch}</p>
                            <p><strong>Email:</strong> {student.email}</p>
                            <p><strong>Phone:</strong> {student.ph_number}</p>
                            <p><strong>Gender:</strong> {student.gender}</p>
                            <p><strong>CGPA:</strong> {student.cgpa}</p>
                            <p><strong>Faculty Advisor:</strong> {student.faculty_advisor}</p>
                        </div>
                    ))
                ) : (
                    <p>No students assigned to this faculty.</p>
                )}
            </div>
            <div className="App">
                <ResultTable facultyId={facultyUserId} />
            </div>
            
        </div>
    );
};

export default FacultyDashboard;
