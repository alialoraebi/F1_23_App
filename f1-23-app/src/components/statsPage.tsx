import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.js';
import { lapTimes } from '../data/f1_2023_gp_lap_times.ts'
import AddStatsPage from './addStatsPage.tsx';
import Modal from './Modal.js';

interface RacerStats {
    _id: string;  
    userId: string;
    grandPrix: string;
    year: number;
    points: number;
    fastestQualiLap: string;
    fastestRaceLap: string;
    qualiPosition: number;
    racePosition: number;
    didNotFinish: boolean;
}

function StatsPage() {
    const [racerStats, setRacerStats] = useState<RacerStats[]>([]);
    const [showAddStats, setShowAddStats] = useState(false);
    const [selectedGrandPrix, setSelectedGrandPrix] = useState('');
    const [selectedStat, setSelectedStat] = useState<RacerStats | null>(null);
    const { token, userId } = useContext(AuthContext);

    useEffect(() => {
        const statsData = { userId };
        const fetchStats = async () => {
            try {
                const response = await axios.post('http://localhost:4000/api/racer-stats', statsData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRacerStats(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStats();
    }, [userId, token]);

    const openAddStatsModal = (grandPrix: string) => {
        setSelectedStat(null);
        setSelectedGrandPrix(grandPrix); 
        setShowAddStats(true);
    };

    const openEditStatsModal = (stat: RacerStats) => {
        setSelectedStat(stat);
        setShowAddStats(true);
    };

    const closeStatsModal = () => {
        setShowAddStats(false);
    };

    const handleSaveStats = async (statsData) => {
        const endpoint = selectedStat ? `http://localhost:4000/api/racer-stats/${selectedStat._id}` : 'http://localhost:4000/api/racer-stats';
        const method = selectedStat ? 'put' : 'post';
        
        try {
            const response = await axios[method](endpoint, { ...statsData, userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (selectedStat) {
                // Update an existing stat
                setRacerStats(prev => prev.map(stat => stat._id === response.data._id ? response.data : stat));
            } else {
                // Add a new stat
                setRacerStats(prev => [...prev, response.data]);
            }
            closeStatsModal();
        } catch (error) {
            console.error("Error saving stats:", error.response ? error.response.data : error.message);
        }
    };
    
    const fetchRacerStats = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/racer-stats?userId=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRacerStats(response.data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }, [userId, token]); 
    
    useEffect(() => {
        fetchRacerStats();
    }, [fetchRacerStats]); 


    return (
        <div>
            <h1>F1 2023 Lap Times</h1>
            <table>
                <thead>
                    <tr>
                        <th>Grand Prix</th>
                        <th>Driver</th>
                        <th>Car</th>
                        <th>Fastest Lap</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {lapTimes.map((lapTime, index) => {
                        const stat = racerStats.find(s => s.grandPrix === lapTime.grandPrix && s.userId === userId);
                        return (
                            <tr key={index}>
                                <td>{lapTime.grandPrix}</td>
                                <td>{lapTime.driver}</td>
                                <td>{lapTime.car}</td>
                                <td>{lapTime.time}</td>
                                <td>
                                    {stat ? (
                                        <button onClick={() => openEditStatsModal(stat)}>
                                            {stat.fastestRaceLap || "No time"}
                                        </button>
                                    ) : (
                                        <button onClick={() => openAddStatsModal(lapTime.grandPrix)}>Add Stat</button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {showAddStats && (
                <Modal isOpen={showAddStats} onClose={closeStatsModal}>
                    <AddStatsPage
                        isOpen={showAddStats}
                        grandPrix={selectedStat ? selectedStat.grandPrix : selectedGrandPrix}
                        onClose={closeStatsModal}
                        onSave={handleSaveStats}
                    />
                </Modal>
            )}
        </div>
    );
    
}

export default StatsPage;