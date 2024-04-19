import React, { useState } from 'react';
import { RacerStats } from './statsPage.tsx';
import { lapTimes } from '../data/f1_2023_gp_lap_times.ts';
import InputMask from 'react-input-mask';


interface UserStatsProps {
  stat: RacerStats;
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (stat: RacerStats) => void;
}

function UserStats({ stat, open, onClose, onDelete, onUpdate }: UserStatsProps) {
  const [updatedStat, setUpdatedStat] = useState(stat);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(stat._id);
      onClose();
    }
  };

  const handleUpdate = () => {
    setIsEditing(true);
  };

  function validateLapTime(lapTime: string): boolean {
    const regex = /^\d:\d{2}:\d{3}$/;
    return regex.test(lapTime);
  }

  const handleSave = () => {
    if (!validateLapTime(updatedStat.fastestQualiLap) || !validateLapTime(updatedStat.fastestRaceLap)) {
      setErrorMessage("Invalid lap time format. Please use the format M:SS:MMM.");
      return;
    }

    const finalUpdatedStat = {
      ...updatedStat,
      points: updatedStat.points || 0,
      qualiPosition: updatedStat.qualiPosition || 0,
      racePosition: updatedStat.racePosition || 0,
    };

    onUpdate(finalUpdatedStat);
    setIsEditing(false);
  };

  const handleChange = (event) => {
    const { name, type } = event.target;
    const value = type === 'checkbox' ? event.target.checked : event.target.value;
    setUpdatedStat(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const fastestLap = lapTimes.find(lap => lap.grandPrix === stat.grandPrix)?.time;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <h2 className="text-2xl font-bold underline mb-4">{stat.grandPrix}</h2>
        {isEditing ? (
          <>
          <div className="mb-4">
              <label className="block text-gray-700">
                Year:
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" name="year" value={updatedStat.year} onChange={handleChange} required>
                  <option value="">Select a year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Points:
                <select name="points" value={updatedStat.points} onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  <option value="">Select points</option>
                  {[25, 18, 15, 12, 10, 8, 6, 4, 2, 1].map(point => (
                    <option key={point} value={point}>{point}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Fastest Qualifying Lap:
                <InputMask mask="9:99:999" value={updatedStat.fastestQualiLap} onChange={handleChange}>
                  {(inputProps) => <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" {...inputProps} type="text" name="fastestQualiLap" required />}
                </InputMask>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Fastest Race Lap:
                <InputMask mask="9:99:999" value={updatedStat.fastestRaceLap} onChange={handleChange}>
                  {(inputProps) => <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" {...inputProps} type="text" name="fastestRaceLap" required />}
                </InputMask>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Qualifying Position:
                <select name="qualiPosition" value={updatedStat.qualiPosition} onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  <option value="">Select a position</option>
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Race Position:
                <select name="racePosition" value={updatedStat.racePosition} onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  <option value="">Select a position</option>
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center text-gray-700">
                Did Not Finish:
                <input className="ml-2" type="checkbox" name="didNotFinish" checked={updatedStat.didNotFinish} onChange={handleChange} />
              </label>
            </div>
            <p className="mb-4">Fastest Lap (Real Data): {fastestLap}</p>
            <div className="flex justify-between space-x-2">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" onClick={handleSave}>Save</button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" onClick={handleDelete}>Delete</button>
              <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg font-bold mb-2">Year: <span className="font-normal float-right">{stat.year}</span></p>
            <p className="text-lg font-bold mb-2">Points: <span className="font-normal float-right">{stat.points}</span></p>
            <p className="text-lg font-bold mb-2">Fastest Quali Lap: <span className="font-normal float-right">{stat.fastestQualiLap}</span></p>
            <p className="text-lg font-bold mb-2">Fastest Race Lap: <span className="font-normal float-right">{stat.fastestRaceLap}</span></p>
            <p className="text-lg font-bold mb-2">Quali Position: <span className="font-normal float-right">{stat.qualiPosition}</span></p>
            <p className="text-lg font-bold mb-2">Race Position: <span className="font-normal float-right">{stat.racePosition}</span></p>
            <p className="text-lg font-bold mb-2">Did Not Finish: <span className="font-normal float-right">{stat.didNotFinish ? '✔' : '❌'}</span></p>
            <p className="text-lg font-bold mb-6">Fastest Lap (Real Data): <span className="font-normal float-right">{fastestLap}</span></p>
            <div className="flex justify-end">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline" onClick={handleUpdate}>Update</button>
              <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );     
}

export default UserStats;