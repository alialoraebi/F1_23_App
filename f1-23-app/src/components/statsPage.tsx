import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { lapTimes } from '../data/f1_2023_gp_lap_times.ts'

interface RacerStats {
    _id: string;  // Assuming the ID field is called 'id', change to '_id' if that's what your API uses
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
    const { token, userId } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/racer-stats?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRacerStats(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStats();
    }, [userId, token]);

    const navigateToAddStats = (grandPrix) => {
        // Navigate to AddStatsPage with grandPrix as a parameter
        navigate(`/add-stats/${grandPrix}`);
    };

    const navigateToUserStats = (userStatId) => {
        // Navigate to a page where the user can view, update, and delete their stat
        navigate(`/user-stats/${userStatId}`);
    };

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
                        // Check if the user has added their stats for this grandPrix
                        const userStat = racerStats.find(stat => stat.grandPrix === lapTime.grandPrix);
                        return (
                            <tr key={index}>
                                <td>{lapTime.grandPrix}</td>
                                <td>{lapTime.driver}</td>
                                <td>{lapTime.car}</td>
                                <td>{lapTime.time}</td>
                                <td>
                                    {userStat ? (
                                        <button onClick={() => navigateToUserStats(userStat._id)}>View/Edit</button>
                                    ) : (
                                        <button onClick={() => navigateToAddStats(lapTime.grandPrix)}>Add Stats</button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default StatsPage;