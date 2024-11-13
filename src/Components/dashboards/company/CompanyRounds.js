import React, { useEffect, useState } from 'react';
import './CompanyRounds.css'; // Import CSS file for styling

const CompanyRounds = ({ companyId, id }) => {
    const [rounds, setRounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRoundId, setExpandedRoundId] = useState(null);

    useEffect(() => {
        const fetchRounds = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/${companyId}/rounds/${id}/`);
                if (response.ok) {
                    const data = await response.json();
                    setRounds(data.rounds);
                } else {
                    setError("Failed to load rounds");
                }
            } catch (error) {
                setError("An error occurred while fetching rounds");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRounds();
    }, [companyId, id]);

    const handleDeleteRound = async (roundId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/rounds/delete/${roundId}/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setRounds(rounds.filter((round) => round.round_id !== roundId));
            } else {
                console.error("Failed to delete round");
            }
        } catch (error) {
            console.error("An error occurred while deleting the round:", error);
        }
    };

    const handleToggleStatus = async (roundId, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:8000/api/rounds/toggle-status/${roundId}/`);
            if (response.ok) {
                const data = await response.json();
                const newStatus = data.new_status;

                // Update the rounds state to reflect the new status
                setRounds((prevRounds) =>
                    prevRounds.map((round) =>
                        round.round_id === roundId ? { ...round, status: newStatus } : round
                    )
                );
            } else {
                console.error("Failed to toggle status");
            }
        } catch (error) {
            console.error("An error occurred while toggling status:", error);
        }
    };

    const toggleExpandRound = (roundId) => {
        setExpandedRoundId(expandedRoundId === roundId ? null : roundId);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const getRoundColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'yellow';  // Scheduled -> Yellow
            case 'Completed':
                return 'green';  // Completed -> Green
            case 'Cancelled':
                return 'red';  // Cancelled -> Red
            default:
                return 'white';
        }
    };

    return (
        <div className="rounds-container">
            <h2>Rounds</h2>
            {rounds.length === 0 ? (
                <p>No rounds available for this position.</p>
            ) : (
                <ul className="rounds-list">
                    {rounds.map((round) => (
                        <li
                            key={round.round_id}
                            className={`round-item ${expandedRoundId === round.round_id ? 'expanded' : 'compressed'}`}
                            onClick={() => toggleExpandRound(round.round_id)}
                            style={{ backgroundColor: getRoundColor(round.status) }} // Set background color based on status
                        >
                            <div className="round-summary">
                                <p>Round Name: {round.round_name}</p>
                            </div>
                            {expandedRoundId === round.round_id && (
                                <div className="round-details">
                                    <p>Round No: {round.round_no}</p>
                                    <p>Date: {round.date}</p>
                                    <p>Time: {round.time_scheduled}</p>
                                    <p>Status: {round.status}</p>
                                    <p>Type: {round.type}</p>
                                    <button className="delete-round-button" onClick={(e) => { e.stopPropagation(); handleDeleteRound(round.round_id); }}>
                                        Delete Round
                                    </button>
                                    <button className="toggle-status-button" onClick={(e) => { e.stopPropagation(); handleToggleStatus(round.round_id, round.status); }}>
                                        Toggle Status
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CompanyRounds;
