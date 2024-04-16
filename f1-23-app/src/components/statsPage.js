import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

function StatsPage() {
    const [stats, setStats] = useState([]);
    const { token, userId } = useContext(AuthContext);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/racer-stats?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setStats(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStats();
    }, [userId, token]);

    return (
        <div>
            <h1>Racer Stats</h1>
            {stats.map((stat, index) => (
                <div key={index}>
                    <h2>{stat.grandPrix} ({stat.year})</h2>
                    <p>Points: {stat.points}</p>
                    <p>Fastest Qualifying Lap: {stat.fastestQualiLap}</p>
                    <p>Fastest Race Lap: {stat.fastestRaceLap}</p>
                    <p>Qualifying Position: {stat.qualiPosition}</p>
                    <p>Race Position: {stat.racePosition}</p>
                    <p>Did Not Finish: {stat.didNotFinish ? 'Yes' : 'No'}</p>
                </div>
            ))}
        </div>
    );
}

export default StatsPage;