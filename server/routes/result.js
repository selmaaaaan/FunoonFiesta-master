const express = require('express');
const router = express.Router();
const Result = require('../models/resultSchema');

router.get('/', async (req, res) => {
    try {
        const results = await Result.find();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await Result.create(req.body);
        try {
            await req.pusher.trigger('results-channel', 'new-result', { result });
        } catch (pusherError) {
            console.error('Pusher trigger failed on create:', pusherError);
        }
        res.status(201).json({
            message: 'Data created successfully.',
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            message: 'Failed to create data. Transaction rolled back.',
        });
    }
});

// Update an existing result
router.put('/:id', async (req, res) => {
    try {
        const updatedResult = await Result.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedResult) {
            return res.status(404).json({ message: 'Result not found' });
        }
        try {
            await req.pusher.trigger('results-channel', 'update-result', { result: updatedResult });
        } catch (pusherError) {
            console.error('Pusher trigger failed on update:', pusherError);
        }
        res.status(200).json(updatedResult);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a result
router.delete('/:id', async (req, res) => {
    try {
        const deletedResult = await Result.findByIdAndDelete(req.params.id);
        if (!deletedResult) {
            return res.status(404).json({ message: 'Result not found' });
        }
        try {
            await req.pusher.trigger('results-channel', 'delete-result', { id: req.params.id });
        } catch (pusherError) {
            console.error('Pusher trigger failed on delete:', pusherError);
        }
        res.status(200).json({ message: 'Result deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
