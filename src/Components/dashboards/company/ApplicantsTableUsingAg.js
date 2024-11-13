import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 
import './ApplicantsTableUsingAg.css';

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

    const columnDefs = [
        { headerName: "Student Name", field: "student.name", sortable: true, filter: true },
        { headerName: "CGPA", field: "student.cgpa", sortable: true, filter: true },
        { headerName: "SRN", field: "student.SRN", sortable: true, filter: true },
        { headerName: "Email", field: "student.email", sortable: true, filter: true },
        {
            headerName: "Internship/Job",
            field: "internship.name",
            valueGetter: (params) => params.data.type === 'Internship' ? params.data.internship.name : params.data.job.name,
            sortable: true,
            filter: true
        },
        { headerName: "Application Type", field: "type", sortable: true, filter: true },
        { headerName: "Faculty Advisor", field: "student.faculty_advisor", sortable: true, filter: true }
    ];

    const defaultColDef = {
        flex: 1,
        minWidth: 100,
        resizable: true,
        filter: true,
        sortable: true,
    };

    return (
        <div className="applicants-table">
            <h2>List of Applicants for Company {companyName}</h2>
            <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={applicants}
                    defaultColDef={defaultColDef}
                    domLayout='autoHeight'
                    pagination={true}
                    paginationPageSize={10}
                />
            </div>
        </div>
    );
};

export default ApplicantsTable;
