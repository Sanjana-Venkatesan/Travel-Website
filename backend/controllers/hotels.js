const router = require('express').Router();
const Hotel = require('../models/hotel');

// Create a new hotel
router.post('/', async (req, res) => {
    try {
        const newHotel = new Hotel(req.body);
        const savedHotel = await newHotel.save();
        res.status(201).json(savedHotel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all hotels
router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get hotel by ID
router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a hotel by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedHotel) return res.status(404).json({ message: 'Hotel not found' });
        res.status(200).json(updatedHotel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a hotel by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) return res.status(404).json({ message: 'Hotel not found' });
        res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
