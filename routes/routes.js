const express = require('express');

const router = express.Router();

const authorizationRoutes = require('./authorizationRoutes.js');
const ticketRoutes = require('./ticketRoutes.js');
const statusRoutes = require('./statusRoutes.js');
const userRoutes = require('./userRoutes.js');

router.use('/authorization', authorizationRoutes);
router.use('/ticket', ticketRoutes);
router.use('/status', statusRoutes);
router.use('/user', userRoutes);

router.use('*', (req, res) => {
    return res.status(500).json({
        error: 'Resource doesn\'t exist on the server.',
    });
});

module.exports = router;
