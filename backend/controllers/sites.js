const router = require('express').Router();
const Site = require('../models/site');

// Create a new site
router.post('/', async (req, res) => {
    try {
        const newSite = new Site(req.body);
        const savedSite = await newSite.save();
        res.status(201).json(savedSite);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all sites
router.get('/', async (req, res) => {
    try {
        const sites = await Site.find();
        res.status(200).json(sites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get site by ID
router.get('/:id', async (req, res) => {
    try {
        const site = await Site.findById(req.params.id);
        if (!site) return res.status(404).json({ message: 'Site not found' });
        res.status(200).json(site);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a site by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedSite = await Site.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedSite) return res.status(404).json({ message: 'Site not found' });
        res.status(200).json(updatedSite);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a site by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedSite = await Site.findByIdAndDelete(req.params.id);
        if (!deletedSite) return res.status(404).json({ message: 'Site not found' });
        res.status(200).json({ message: 'Site deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
