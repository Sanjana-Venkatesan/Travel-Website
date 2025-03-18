const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
    try {
        const { name,email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({ name,email, passwordHash });
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;