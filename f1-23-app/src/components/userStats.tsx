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
    <div className="dialog-backdrop">
      <div className="dialog">
        {errorMessage && <div style={{color: 'red'}}>{errorMessage}</div>}
        <h2>{stat.grandPrix}</h2>
        {isEditing ? (
          <>
            <label>
              Year:
              <select name="year" value={updatedStat.year} onChange={handleChange} required>
                <option value="">Select a year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </label>
            <label>
              Points:
              <input type="number" name="points" value={updatedStat.points} onChange={handleChange} />
            </label>
            <label>
              Fastest Qualifying Lap:
              <InputMask mask="9:99:999" value={updatedStat.fastestQualiLap} onChange={handleChange}>
                {(inputProps) => <input {...inputProps} type="text" name="fastestQualiLap" title="Please enter a valid lap time in the format M:SS:MMM" required />}
              </InputMask>
            </label>
            <label>
              Fastest Race Lap:
              <InputMask mask="9:99:999" value={updatedStat.fastestRaceLap} onChange={handleChange}>
                {(inputProps) => <input {...inputProps} type="text" name="fastestRaceLap" title="Please enter a valid lap time in the format M:SS:MMM" required />}
              </InputMask>
            </label>
            <label>
              Qualifying Position:
              <input type="number" name="qualiPosition" value={updatedStat.qualiPosition} onChange={handleChange} />
            </label>
            <label>
              Race Position:
              <input type="number" name="racePosition" value={updatedStat.racePosition} onChange={handleChange} />
            </label>
            <label>
              Did Not Finish:
              <input name="didNotFinish" type="checkbox" checked={updatedStat.didNotFinish} onChange={handleChange} />
            </label>
            <p>Fastest Lap (Real Data): {fastestLap}</p>
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p>Year: {stat.year}</p>
            <p>Points: {stat.points}</p>
            <p>Fastest Quali Lap: {stat.fastestQualiLap}</p>
            <p>Fastest Race Lap: {stat.fastestRaceLap}</p>
            <p>Quali Position: {stat.qualiPosition}</p>
            <p>Race Position: {stat.racePosition}</p>
            <p>Did Not Finish: {stat.didNotFinish ? '✔' : '❌'}</p>
            <p>Fastest Lap (Real Data): {fastestLap}</p>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );              
}

export default UserStats;