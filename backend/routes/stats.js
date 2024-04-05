const express = require('express');
const router = express.Router();
const RacerStats = require('../model/racerStats.js');
const User = require('../model/user.js');

router.post('/racer-stats', async (req, res) => {
    try {
        const { userId, grandPrix, year } = req.body;

        // Check if user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if an entry for this Grand Prix in the given year already exists for this user
        const existingStat = await RacerStats.findOne({ userId, grandPrix, year });
        if (existingStat) {
            return res.status(409).json({ message: `You have already submitted stats for the ${grandPrix} in ${year}` });
        }

        const newStat = new RacerStats(req.body);
        const savedStat = await newStat.save();
        res.status(201).json(savedStat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET route to retrieve all racer stats
router.get('/racer-stats', async (req, res) => {
    try {
        const stats = await RacerStats.find();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET route to retrieve a specific racer's stats by userID
router.get('/racer-stats/user/:userId', async (req, res) => {
    try {
        const stats = await RacerStats.find({ userId: req.params.userId });
        if (stats.length === 0) {
            return res.status(404).json({ message: 'No stats found for this user' });
        }
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET route to retrieve stats by Race ID
router.get('/racer-stats/:id', async (req, res) => {
    try {
        const raceId = req.params.id;
        const stat = await RacerStats.findById(raceId);

        if (!stat) {
            return res.status(404).json({ message: `No stats found for the race with ID: ${raceId}` });
        }

        res.json(stat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// PUT route to update racer stats
router.put('/racer-stats/:id', async (req, res) => {
    try {
        const userExists = await User.findById(req.body.userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedStat = await RacerStats.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE route to delete racer stats
router.delete('/racer-stats/:id', async (req, res) => {
    try {
        const stat = await RacerStats.findById(req.params.id);
        if (!stat) {
            return res.status(404).json({ message: 'Racer stat not found' });
        }

        const deletedStat = await RacerStats.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Successfully', deletedStat });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
