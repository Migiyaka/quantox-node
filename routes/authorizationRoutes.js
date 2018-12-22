const express = require('express');

const authorizationService = require('../services/authorizationService');

const router = express.Router();

router.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(500).json({
            error: 'Wrong login info. Please try again.',
        });
    }

    try {
        const token = await authorizationService.login(req.body.username, req.body.password);

        return res.status(200).json({
            token,
            message: 'User logged in.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.post('/register', async (req, res) => {
    try {
        await authorizationService.register(req.body.firstName, req.body.lastName, req.body.email,
            req.body.username, req.body.password);

        return res.status(200).json({
            message: 'User registration successful.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.get('/:token', async (req, res) => {
    try {
        const user = await authorizationService.findUserByToken(req.params.token, 'loginJwtSecret');

        return res.status(200).json({
            user,
            message: 'User data loaded.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.get('/activate/:token', async (req, res) => {
    try {
        const user = await authorizationService.findUserByToken(req.params.token, 'activationJwtSecret');
        await authorizationService.activate(user.id);

        req.app.get('io').emit('updateData');

        return res.status(200).json({
            message: 'User activated! You can log in now.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.patch('/activate/:id', async (req, res) => {
    try {
        await authorizationService.activate(req.params.id);

        req.app.get('io').emit('updateData');

        return res.status(200).json({
            message: 'User activated.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

module.exports = router;
