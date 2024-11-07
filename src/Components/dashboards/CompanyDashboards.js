import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './CompanyDashboard.css';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard = () => {
    const [internships, setInternships] = useState([]);
    const [fullTimeJobs, setFullTimeJobs] = useState([]);
    const [internshipForm, setInternshipForm] = useState({ name: '', location: '', stipend: '', ppo: false, type: '', duration: '', cutoff: '' });
    const [fullTimeForm, setFullTimeForm] = useState({ job_title: '', location: '', package: '', cutoff: '' });
    const [editInternshipId, setEditInternshipId] = useState(null);
    const [editFullTimeJobId, setEditFullTimeJobId] = useState(null);

    axios.defaults.baseURL = 'http://localhost:8000';

    const navigate = useNavigate();
    const userType = localStorage.getItem('userType');
    const companyId = localStorage.getItem('CompanyId');  // Retrieve CompanyId from localStorage

    const fetchOffers = useCallback(async () => {
        try {
            const internshipResponse = await axios.get(`/api/internship/?company=${companyId}`);
            const fullTimeResponse = await axios.get(`/api/fulltime/?company=${companyId}`);
            setInternships(internshipResponse.data);
            setFullTimeJobs(fullTimeResponse.data);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    }, [companyId]);

    useEffect(() => {
        if (userType !== 'company') {
            navigate('/dashboard');
        }
        fetchOffers();
    }, [userType, navigate, fetchOffers]);

    
    const handleInputChange = (e, formType) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;

        if (formType === 'internship') {
            setInternshipForm((prev) => ({ ...prev, [name]: updatedValue }));
        } else {
            setFullTimeForm((prev) => ({ ...prev, [name]: updatedValue }));
        }
    };

    const handleAddOrUpdate = async (type, isUpdate = false, id = null) => {
        const formData = type === 'internship' ? { ...internshipForm, company: companyId } : { ...fullTimeForm, company: companyId };
        const endpoint = `/api/${type}${isUpdate ? `/${id}` : ''}/`;
        const method = isUpdate ? 'put' : 'post';

        try {
            await axios({ method, url: endpoint, data: formData });
            fetchOffers();
            // Clear the form after submit
            setInternshipForm({ name: '', location: '', stipend: '', ppo: false, type: '', duration: '', cutoff: '' });
            setFullTimeForm({ job_title: '', location: '', package: '', cutoff: '' });
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const handleDelete = async (type, id) => {
        if (!id) {
            console.error('Delete failed: Invalid ID');
            return;
        }

        try {
            await axios.delete(`/api/${type}/${id}/`);
            fetchOffers();
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const handleEdit = (type, id) => {
        if (type === 'internship') {
            setEditInternshipId(id);
            const internshipToEdit = internships.find((internship) => internship.id === id);
            setInternshipForm({
                name: internshipToEdit.name,
                location: internshipToEdit.location,
                stipend: internshipToEdit.stipend,
                ppo: internshipToEdit.ppo,
                type: internshipToEdit.type,
                duration: internshipToEdit.duration,
                cutoff: internshipToEdit.cutoff,
            });
        } else if (type === 'fulltime') {
            setEditFullTimeJobId(id);
            const jobToEdit = fullTimeJobs.find((job) => job.id === id);
            setFullTimeForm({
                job_title: jobToEdit.job_title,
                location: jobToEdit.location,
                package: jobToEdit.package,
                cutoff: jobToEdit.cutoff,
            });
        }
    };

    return (
        <div className="company-dashboard">
            <h1>Company Dashboard</h1>
            <div className="form-container">
                <div className="form-section">
                    <h2>Manage Internship Offers</h2>
                    <form>
                        <input
                            type="text"
                            name="name"
                            placeholder="Internship Name"
                            value={internshipForm.name}
                            onChange={(e) => handleInputChange(e, 'internship')}
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={internshipForm.location}
                            onChange={(e) => handleInputChange(e, 'internship')}
                        />
                        <input
                            type="number"
                            name="stipend"
                            placeholder="Stipend"
                            value={internshipForm.stipend}
                            onChange={(e) => handleInputChange(e, 'internship')}
                        />
                        <label>
                            <input
                                type="checkbox"
                                name="ppo"
                                checked={internshipForm.ppo}
                                onChange={(e) => handleInputChange(e, 'internship')}
                            />
                            PPO
                        </label>
                        <input
                            type="text"
                            name="type"
                            placeholder="Type"
                            value={internshipForm.type}
                            onChange={(e) => handleInputChange(e, 'internship')}
                        />
                        <input
                            type="number"
                            name="duration"
                            placeholder="Duration (months)"
                            value={internshipForm.duration}
                            onChange={(e) => handleInputChange(e, 'internship')}
                        />
                        <input
                            type="number"
                            name="cutoff"
                            placeholder="Cutoff CGPA"
                            value={internshipForm.cutoff}
                            onChange={(e) => handleInputChange(e, 'internship')}
                        />
                        <button type="button" onClick={() => handleAddOrUpdate('internship', editInternshipId !== null, editInternshipId)}>
                            {editInternshipId ? 'Update Internship' : 'Add Internship'}
                        </button>
                    </form>
                </div>
                
                <div className="form-section">
                    <h2>Manage Full-Time Jobs</h2>
                    <form>
                        <input
                            type="text"
                            name="job_title"
                            placeholder="Job Title"
                            value={fullTimeForm.job_title}
                            onChange={(e) => handleInputChange(e, 'fulltime')}
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={fullTimeForm.location}
                            onChange={(e) => handleInputChange(e, 'fulltime')}
                        />
                        <input
                            type="number"
                            name="package"
                            placeholder="Package"
                            value={fullTimeForm.package}
                            onChange={(e) => handleInputChange(e, 'fulltime')}
                        />
                        <input
                            type="number"
                            name="cutoff"
                            placeholder="Cutoff CGPA"
                            value={fullTimeForm.cutoff}
                            onChange={(e) => handleInputChange(e, 'fulltime')}
                        />
                        <button type="button" onClick={() => handleAddOrUpdate('fulltime', editFullTimeJobId !== null, editFullTimeJobId)}>
                            {editFullTimeJobId ? 'Update Full-Time Job' : 'Add Full-Time Job'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="offers-container">
                <div className="offer-section">
                    <h2>Internship Offers</h2>
                    {internships.map((internship) => (
                        <div key={internship.id} className="offer">
                            <h3>{internship.name}</h3>
                            <p>Location: {internship.location}</p>
                            <p>Stipend: {internship.stipend}</p>
                            <p>Type: {internship.type}</p>
                            <p>Duration: {internship.duration} months</p>
                            <p>Cutoff CGPA: {internship.cutoff}</p>
                            <button onClick={() => handleEdit('internship', internship.id)}>Edit</button>
                            <button onClick={() => handleDelete('internship', internship.id)}>Delete</button>
                        </div>
                    ))}
                </div>

                <div className="offer-section">
                    <h2>Full-Time Jobs</h2>
                    {fullTimeJobs.map((job) => (
                        <div key={job.id} className="offer">
                            <h3>{job.job_title}</h3>
                            <p>Location: {job.location}</p>
                            <p>Package: {job.package}</p>
                            <p>Cutoff CGPA: {job.cutoff}</p>
                            <button onClick={() => handleEdit('fulltime', job.id)}>Edit</button>
                            <button onClick={() => handleDelete('fulltime', job.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
