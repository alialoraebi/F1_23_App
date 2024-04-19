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
        <div className="container mx-auto px-4 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-left mb-12 mt-12">Welcome, {username}</h1>
            <div className="overflow-x-auto">
                <table className="table-auto w-1/2 mb-6 mx-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Grand Prix</th>
                            <th className="py-3 px-6 text-left">Driver</th>
                            <th className="py-3 px-6 text-left">Car</th>
                            <th className="py-3 px-6 text-left">Fastest Lap</th>
                            <th className="py-3 px-6 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {lapTimes.map((lapTime, index) => {
                            const stat = racerStats.find(s => s.grandPrix === lapTime.grandPrix && s.userId === userId);
                            return (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">{lapTime.grandPrix}</td>
                                    <td className="py-3 px-6 text-left">{lapTime.driver}</td>
                                    <td className="py-3 px-6 text-left">{lapTime.car}</td>
                                    <td className="py-3 px-6 text-left">{lapTime.time}</td>
                                    <td className="py-3 px-6 text-center">
                                        {stat ? (
                                        <button onClick={() => openUserStats(stat)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full text-center">
                                            {stat.fastestRaceLap || "No time"}
                                        </button>
                                        ) : (
                                        <button onClick={() => openAddStatsModal(lapTime.grandPrix)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full text-center">
                                            Add
                                        </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
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