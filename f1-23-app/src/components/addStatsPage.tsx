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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded shadow-lg">
                {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        Grand Prix: <span className="text-red-500">*</span>
                        <input type="text" name="grandPrix" value={formData.grandPrix} onChange={handleChange} placeholder="Enter Grand Prix" required className="mt-1 p-2 border rounded w-full" />
                    </label>
                    <label className="block">
                        Year:
                        <select name="year" value={formData.year} onChange={handleChange} required className="mt-1 p-2 border rounded w-full">
                            <option value="">Select a year</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                    </label>
                    <label className="block">
                        Points:
                        <select name="points" value={formData.points} onChange={handleChange} required className="mt-1 p-2 border rounded w-full">
                            <option value="">Select points</option>
                            {[25, 18, 15, 12, 10, 8, 6, 4, 2, 1].map(point => (
                                <option key={point} value={point}>{point}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        Fastest Qualifying Lap:
                        <InputMask mask="9:99:999" value={formData.fastestQualiLap} onChange={handleChange} className="mt-1 p-2 border rounded w-full">
                            {(inputProps) => <input {...inputProps} type="text" name="fastestQualiLap" title="Please enter a valid lap time in the format M:SS:MMM" required />}
                        </InputMask>
                    </label>
                    <label className="block">
                        Fastest Race Lap:
                        <InputMask mask="9:99:999" value={formData.fastestRaceLap} onChange={handleChange} className="mt-1 p-2 border rounded w-full">
                            {(inputProps) => <input {...inputProps} type="text" name="fastestRaceLap" title="Please enter a valid lap time in the format M:SS:MMM" required />}
                        </InputMask>
                    </label>
                    <label className="block">
                        Qualifying Position:
                        <select name="qualiPosition" value={formData.qualiPosition} onChange={handleChange} required className="mt-1 p-2 border rounded w-full">
                            <option value="">Select a position</option>
                            {Array.from({length: 20}, (_, i) => i + 1).map(position => (
                                <option key={position} value={position}>{position}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        Race Position:
                        <select name="racePosition" value={formData.racePosition} onChange={handleChange} required className="mt-1 p-2 border rounded w-full">
                            <option value="">Select a position</option>
                            {Array.from({length: 20}, (_, i) => i + 1).map(position => (
                                <option key={position} value={position}>{position}</option>
                            ))}
                        </select>
                    </label>
                    <label className="flex items-center space-x-2">
                        Did Not Finish: 
                        <input type="checkbox" name="didNotFinish" checked={formData.didNotFinish} onChange={() => setFormData({...formData, didNotFinish: !formData.didNotFinish})} className="mt-1 ml-2" />
                    </label>
                    <div className="flex justify-end space-x-2">
                        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Save</button>
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddStatsPage;
