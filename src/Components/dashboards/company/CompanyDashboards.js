import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import './CompanyDashboard.css';
import { useNavigate } from 'react-router-dom';
import ApplicantsTable from './ApplicantsTable';
import ApplicantsTableUsingAg from './ApplicantsTableUsingAg';
import CompanyRounds from './CompanyRounds';

const CompanyDashboard = () => {
    const [internships, setInternships] = useState([]);
    const [fullTimeJobs, setFullTimeJobs] = useState([]);
    const [internshipForm, setInternshipForm] = useState({ name: '', location: '', stipend: '', ppo: false, type: '', duration: '', cutoff: '' });
    const [fullTimeForm, setFullTimeForm] = useState({ job_title: '', location: '', package: '', cutoff: '' });
    const [editInternshipId, setEditInternshipId] = useState(null);
    const [editFullTimeJobId, setEditFullTimeJobId] = useState(null);
    const [showRoundModal, setShowRoundModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);



    // This is for compressed or long format
    const [expandedInternshipId, setExpandedInternshipId] = useState(null);
    const [expandedJobId, setExpandedJobId] = useState(null);

    const toggleExpandInternship = (internshipId) => {
        setExpandedInternshipId(expandedInternshipId === internshipId ? null : internshipId);
    };

    const toggleExpandJob = (jobId) => {
        setExpandedJobId(expandedJobId === jobId ? null : jobId);
    };

    const [roundForm, setRoundForm] = useState({
        round_no: '',
        round_name: '',
        date: '',
        time_scheduled: '',
        status: 'Scheduled'
    });

    axios.defaults.baseURL = 'http://localhost:8000';


    const navigate = useNavigate();
    const userType = localStorage.getItem('userType');
    const companyId = localStorage.getItem('CompanyId');  // Retrieve CompanyId from localStorage
    const companyName = localStorage.getItem('username');

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

    



    //For Rounds 

    const openRoundModal = (offer, type, offerId) => {
        setSelectedOffer({ ...offer, type });
        localStorage.setItem('offersId', offerId);
        localStorage.setItem('offersType',type);
        setShowRoundModal(true);
    };

    const closeRoundModal = () => {
        setShowRoundModal(false);
        setSelectedOffer(null);
        setRoundForm({ round_no: '', round_name: '', date: '', time_scheduled: '', status: 'Scheduled' });
        
    };

    const handleRoundInputChange = (e) => {
        const { name, value } = e.target;
        setRoundForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateRound = async () => {


        const { id: offerId, type } = selectedOffer;
        const offersId = parseInt(localStorage.getItem('offersId'),10);

        const endpoint = type === 'Internship' ? `/api/create/round/` : `/api/create/round/`;
        const data = {
            company_id: companyId,
            round_no: roundForm.round_no,
            round_name: roundForm.round_name,
            date: roundForm.date,
            time_scheduled: roundForm.time_scheduled,
            status: roundForm.status,
            type,
            internship_id: type === 'Internship' ? offersId : null,
            job_id: type === 'FullTime' ? offersId : null,
        };

        try {
            await axios.post(endpoint, data);
            closeRoundModal();
            fetchOffers();
            //window.location.reload();
        } catch (error) {
            console.error('Error creating round:', error);
        }
    };



        










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



    
    const handleFulltimeDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/fulltime-operation/${id}/`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                alert('Record deleted successfully!');
                fetchOffers(); // Refresh the list after deletion
            } else {
                alert('Failed to delete the record.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the record.');
        }
    };
    
    const handleInternshipDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/internship-operation/${id}/`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                alert('Record deleted successfully!');
                fetchOffers(); // Refresh the list after deletion
            } else {
                alert('Failed to delete the record.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the record.');
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
                    <div
                        key={internship.internship_id}
                        className={`offer ${expandedInternshipId === internship.internship_id ? 'expanded' : 'compressed'}`}
                        onDoubleClick={() => toggleExpandInternship(internship.internship_id)}
                    >
                        <h3>{internship.name}</h3>
                        {expandedInternshipId === internship.internship_id ? (
                            <>
                                <p>Location: {internship.location}</p>
                                <p>Stipend: {internship.stipend}</p>
                                <p>Type: {internship.type}</p>
                                <p>Duration: {internship.duration} months</p>
                                <p>Cutoff CGPA: {internship.cutoff}</p>
                                <button onClick={() => openRoundModal(internship, 'Internship', internship.internship_id)}>Add Round</button>
                                <button className="delete-round-button" onClick={(e) => { e.stopPropagation(); handleInternshipDelete(internship.internship_id); }}>Delete</button>
                                {showRoundModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Round for {selectedOffer.type === 'Internship' ? selectedOffer.name : selectedOffer.job_title}</h2>
                        <form>
                            <input type="number" name="round_no" placeholder="Round Number" value={roundForm.round_no} onChange={handleRoundInputChange} />
                            <input type="text" name="round_name" placeholder="Round Name" value={roundForm.round_name} onChange={handleRoundInputChange} />
                            <input type="date" name="date" placeholder="Date" value={roundForm.date} onChange={handleRoundInputChange} />
                            <input type="time" name="time_scheduled" placeholder="Time Scheduled" value={roundForm.time_scheduled} onChange={handleRoundInputChange} />
                            <select name="status" value={roundForm.status} onChange={handleRoundInputChange}>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <button type="button" onClick={handleCreateRound}>Create Round</button>
                            <button type="button" onClick={closeRoundModal}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
                                <CompanyRounds companyId={companyId} id={internship.internship_id} />
                            </>
                        ) : null}
                    </div>
                ))}
            </div>

            <div className="offer-section">
                <h2>Full-Time Jobs</h2>
                {fullTimeJobs.map((job) => (
                    <div
                        key={job.job_id}
                        className={`offer ${expandedJobId === job.job_id ? 'expanded' : 'compressed'}`}
                        onDoubleClick={() => toggleExpandJob(job.job_id)}
                    >
                        <h3>{job.job_title}</h3>
                        {expandedJobId === job.job_id ? (
                            <>
                                <p>Location: {job.location}</p>
                                <p>Package: {job.package}</p>
                                <p>Cutoff CGPA: {job.cutoff}</p>
                                <button onClick={() => openRoundModal(job, 'FullTime', job.job_id)}>Add Round</button>
                                <button className="delete-round-button" onClick={(e) => { e.stopPropagation(); handleFulltimeDelete(job.job_id); }}>Delete</button>
                                {showRoundModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Round for {selectedOffer.type === 'Internship' ? selectedOffer.name : selectedOffer.job_title}</h2>
                        <form>
                            <input type="number" name="round_no" placeholder="Round Number" value={roundForm.round_no} onChange={handleRoundInputChange} />
                            <input type="text" name="round_name" placeholder="Round Name" value={roundForm.round_name} onChange={handleRoundInputChange} />
                            <input type="date" name="date" placeholder="Date" value={roundForm.date} onChange={handleRoundInputChange} />
                            <input type="time" name="time_scheduled" placeholder="Time Scheduled" value={roundForm.time_scheduled} onChange={handleRoundInputChange} />
                            <select name="status" value={roundForm.status} onChange={handleRoundInputChange}>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <button type="button" onClick={handleCreateRound}>Create Round</button>
                            <button type="button" onClick={closeRoundModal}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
                                <CompanyRounds companyId={companyId} id={job.job_id} />
                            </>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>

            

            <div>


            <div>
            <ApplicantsTable companyId={companyId} companyName={companyName} />
            </div>
                
            <ApplicantsTableUsingAg companyId={companyId} companyName={companyName} />
            <br></br>
            <br></br>
            <br></br>
            </div>

            

            

        </div>
        
    );
};

export default CompanyDashboard;
