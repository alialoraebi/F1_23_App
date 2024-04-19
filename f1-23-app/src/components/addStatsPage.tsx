import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';


interface AddStatsPageProps {
    isOpen: boolean;
    grandPrix: string;
    onClose: () => void;
    onSave: (data: any) => void; 
    externalErrorMessage: string; 
}

function AddStatsPage({ isOpen, grandPrix, onClose, onSave }: AddStatsPageProps) {
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        grandPrix: '',
        year: '',
        points: '',
        fastestQualiLap: '',
        fastestRaceLap: '',
        qualiPosition: '',
        racePosition: '',
        didNotFinish: false
    });
    
    useEffect(() => {
        if (isOpen) {
            setFormData(prevState => ({
                ...prevState,
                grandPrix
            }));
        }
    }, [isOpen, grandPrix]);

    if (!isOpen) return null;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    function validateLapTime(lapTime: string): boolean {
        const regex = /^\d:\d{2}:\d{3}$/;
        return regex.test(lapTime);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formData.grandPrix || !formData.year || !formData.fastestQualiLap || !formData.fastestRaceLap) {
            alert('All fields are required.');
            return;
        }
    
        // Validate lap time format
        if (!validateLapTime(formData.fastestQualiLap) || !validateLapTime(formData.fastestRaceLap)) {
            setErrorMessage("Invalid lap time format. Please use the format M:SS:MMM.");
            return;
        }
    
        const finalData = {
            ...formData,
            points: formData.points || 0,
            qualiPosition: formData.qualiPosition || 0,
            racePosition: formData.racePosition || 0,
        };
    
        console.log("Form data before sending:", finalData);
        setErrorMessage(''); 
        onSave(finalData);
        onClose();
    };

    return (
        <div className="dialog-backdrop">
            <div className="dialog">
                {errorMessage && <div style={{color: 'red'}}>{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                <label>
                    Grand Prix: <span style={{color: 'red'}}>*</span>
                    <input type="text" name="grandPrix" value={formData.grandPrix} onChange={handleChange} placeholder="Enter Grand Prix" required />
                </label>
                <label>
                    Year:
                    <select name="year" value={formData.year} onChange={handleChange} required>
                        <option value="">Select a year</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                </label>
                <label>
                Points:
                <select name="points" value={formData.points} onChange={handleChange} required>
                    <option value="">Select points</option>
                    {[25, 18, 15, 12, 10, 8, 6, 4, 2, 1].map(point => (
                    <option key={point} value={point}>{point}</option>
                    ))}
                </select>
                </label>
                <label>
                    Fastest Qualifying Lap:
                    <InputMask mask="9:99:999" value={formData.fastestQualiLap} onChange={handleChange}>
                        {(inputProps) => <input {...inputProps} type="text" name="fastestQualiLap" title="Please enter a valid lap time in the format M:SS:MMM" required />}
                    </InputMask>
                </label>
                <label>
                    Fastest Race Lap:
                    <InputMask mask="9:99:999" value={formData.fastestRaceLap} onChange={handleChange}>
                        {(inputProps) => <input {...inputProps} type="text" name="fastestRaceLap" title="Please enter a valid lap time in the format M:SS:MMM" required />}
                    </InputMask>
                </label>
                <label>
                    Qualifying Position:
                    <select name="qualiPosition" value={formData.qualiPosition} onChange={handleChange} required>
                        <option value="">Select a position</option>
                        {Array.from({length: 20}, (_, i) => i + 1).map(position => (
                        <option key={position} value={position}>{position}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Race Position:
                    <select name="racePosition" value={formData.racePosition} onChange={handleChange} required>
                        <option value="">Select a position</option>
                        {Array.from({length: 20}, (_, i) => i + 1).map(position => (
                        <option key={position} value={position}>{position}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Did Not Finish:
                    <input type="checkbox" name="didNotFinish" checked={formData.didNotFinish} onChange={() => setFormData({...formData, didNotFinish: !formData.didNotFinish})} />
                </label>
                <button type="submit">Save Stats</button>
                <button type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
}

export default AddStatsPage;
