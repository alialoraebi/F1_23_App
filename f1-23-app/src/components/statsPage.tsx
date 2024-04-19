import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.js';
import { lapTimes } from '../data/f1_2023_gp_lap_times.ts'
import AddStatsPage from './addStatsPage.tsx';
import Modal from './Modal.js';
import UserStats from './userStats.tsx';

export interface RacerStats {
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
    const [showUserStats, setShowUserStats] = useState(false);
    const [selectedGrandPrix, setSelectedGrandPrix] = useState('');
    const [selectedStat, setSelectedStat] = useState<RacerStats | null>(null);
    const [username, setUsername] = useState('');
    const { token, userId } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');

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

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/user/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsername(response.data.username);
            } catch (error) {
                console.error("Error fetching username:", error.response ? error.response.data : error.message);
            }
        };
    
        fetchUsername();
    }, [userId, token]);

    const openAddStatsModal = (grandPrix: string) => {
        setSelectedStat(null);
        setSelectedGrandPrix(grandPrix); 
        setShowAddStats(true);
        
    };

    const closeStatsModal = () => {
        setShowAddStats(false);
    };

    function validateLapTime(lapTime: string): boolean {
        const regex = /^\d:\d{2}:\d{3}$/;
        return regex.test(lapTime);
    }

    const handleSaveStats = async (statsData) => {
        console.log('Saving stats:', statsData);
    
        if (!validateLapTime(statsData.fastestQualiLap) || !validateLapTime(statsData.fastestRaceLap)) {
            console.error("Invalid lap time format. Please use the format M:SS:MMM.");
            setErrorMessage("Invalid lap time format. Please use the format M:SS:MMM."); 
            return;
        }
    
        const endpoint = selectedStat ? `http://localhost:4000/api/racer-stats/${selectedStat._id}` : 'http://localhost:4000/api/racer-stats';
        const method = selectedStat ? 'put' : 'post';
        
        try {
            const response = await axios[method](endpoint, { ...statsData, userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (selectedStat) {
                setRacerStats(prev => prev.map(stat => stat._id === response.data._id ? response.data : stat));
            } else {
                setRacerStats(prev => [...prev, response.data]);
            }
            closeStatsModal();
            fetchRacerStats();
            setErrorMessage(''); 
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

    const openUserStats = (stat: RacerStats) => {
        setSelectedStat(stat);
        setShowUserStats(true);
      };
      
      const closeUserStats = () => {
        setShowUserStats(false);
      };
      
      const handleDeleteStat = async (id: string) => {
        try {
          await axios.delete(`http://localhost:4000/api/racer-stats/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRacerStats(prev => prev.filter(stat => stat._id !== id));
        } catch (error) {
          console.error("Error deleting stat:", error.response ? error.response.data : error.message);
        }
      };
      
      const handleUpdateStat = (stat: RacerStats) => {
        handleSaveStats(stat);
        openUserStats(stat);
      };


    return (
        <div>
            <h1>Welcome, {username}</h1>
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
                                        <button onClick={() => openUserStats(stat)}>
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
                        externalErrorMessage={errorMessage}
                    />
                </Modal>
            )}
            {showUserStats && selectedStat && (
                <UserStats
                    stat={selectedStat}
                    open={showUserStats}
                    onClose={closeUserStats}
                    onDelete={handleDeleteStat}
                    onUpdate={handleUpdateStat}
                />
            )}
        </div>
    );
    
}

export default StatsPage;