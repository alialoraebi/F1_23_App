import React, { useState } from 'react';

interface AddStatsPageProps {
    isOpen: boolean;
    grandPrix: string;
    onClose: () => void;
    onSave: (data: any) => void;  
}

function AddStatsPage({ isOpen, onClose, onSave }: AddStatsPageProps) {
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

    if (!isOpen) return null;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formData.grandPrix || !formData.year || !formData.points || !formData.fastestQualiLap || !formData.fastestRaceLap || !formData.qualiPosition || !formData.racePosition) {
            alert('All fields are required.');
            return;
        }
        console.log("Form data before sending:", formData);
        onSave(formData);
        onClose();
    };

    return (
        <div className="dialog-backdrop">
            <div className="dialog">
                <form onSubmit={handleSubmit}>
                    <label>
                        Grand Prix:
                        <input type="text" name="grandPrix" value={formData.grandPrix} onChange={handleChange} />
                    </label>
                    <label>
                        Year:
                        <input type="number" name="year" value={formData.year} onChange={handleChange} />
                    </label>
                    <label>
                        Points:
                        <input type="number" name="points" value={formData.points} onChange={handleChange} />
                    </label>
                    <label>
                        Fastest Quali Lap:
                        <input type="text" name="fastestQualiLap" value={formData.fastestQualiLap} onChange={handleChange} />
                    </label>
                    <label>
                        Fastest Race Lap:
                        <input type="text" name="fastestRaceLap" value={formData.fastestRaceLap} onChange={handleChange} />
                    </label>
                    <label>
                        Qualifying Position:
                        <input type="number" name="qualiPosition" value={formData.qualiPosition} onChange={handleChange} />
                    </label>
                    <label>
                        Race Position:
                        <input type="number" name="racePosition" value={formData.racePosition} onChange={handleChange} />
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
