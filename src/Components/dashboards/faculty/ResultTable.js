import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ResultTable.css';

const ResultTable = ({ facultyId }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/students-result/faculty/${facultyId}/`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [facultyId]);

  return (
    <div className="students-container">
      <h2>Placed Students List</h2>
      <div className="students-grid">
        {students.length > 0 ? (
          students.map((student) => (
            <div className="student-card" key={student.student_id}>
              <div className="card-header">
                <h3>{student.student_name}</h3> 
              </div>
              <div className="card-body">
                <p>{student.company_name}</p>
                <p><strong>SRN:</strong> {student.srn}</p>
                <p><strong>Type:</strong> {student.application_type}</p>
                <p><strong>Post:</strong> {student.post}</p>
                <p><strong>Package/Stipend:</strong> {student.compensation}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No students found</p>
        )}
      </div>
    </div>
  );
};

export default ResultTable;
