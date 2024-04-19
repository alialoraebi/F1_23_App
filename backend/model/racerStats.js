const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const racerStatsSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'users',               
        required: true
    },
    grandPrix:{
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    points:{
        type: Number,
        min: 0,
        max: 25
    },
    fastestQualiLap: {
        type: String,
        required: true,
        match: /^\d{1}:\d{2}.\d{3}$/
    },
    fastestRaceLap: {
        type: String,
        required: true,
        match: /^\d{1}:\d{2}.\d{3}$/
    },
    qualiPosition:{
        type: Number,
        min: 0,
        max: 20
    },
    racePosition:{
        type: Number,
        min: 0,
        max: 20
    },
    didNotFinish: {
        type: Boolean,
        required: true,
        default: false
    },
}, {timestamps: true});

module.exports = mongoose.model("racerStats", racerStatsSchema);