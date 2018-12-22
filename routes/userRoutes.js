const express = require('express');

const userService = require('../services/userService');
const authorizationService = require('../services/authorizationService');

const router = express.Router();

router.get('/', authorizationService.isPermitted(['user', 'admin']), async (req, res) => {
    try {
        const userList = await userService.findAll();

        return res.status(200).json({
            list: userList,
            message: 'Users found.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.delete('/:id', authorizationService.isPermitted(['admin']), async (req, res) => {
    try {
        const actionUser = await authorizationService.findUserFromHeaders(req.headers);
        await userService.delete(req.params.id, actionUser);

        req.app.get('io').emit('updateData');

        return res.status(200).json({
            message: 'User deleted.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

module.exports = router;
