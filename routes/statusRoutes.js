const express = require('express');

const statusService = require('../services/statusService');
const authorizationService = require('../services/authorizationService');

const router = express.Router();

router.get('/', authorizationService.isPermitted(['user', 'admin']), async (req, res) => {
    try {
        const statusList = await statusService.findAll();

        return res.status(200).json({
            list: statusList,
            message: 'Ticket statuses found.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.post('/', authorizationService.isPermitted(['admin']), async (req, res) => {
    try {
        const actionUser = await authorizationService.findUserFromHeaders(req.headers);
        await statusService.create(req.body.name, req.body.text, actionUser.id);

        req.app.get('io').emit('updateData');

        return res.status(200).json({
            message: 'Ticket created.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.get('/:id', authorizationService.isPermitted(['admin']), async (req, res) => {
    try {
        const status = await statusService.findById(req.params.id);

        return res.status(200).json({
            status,
            message: 'Status found.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.patch('/:id', authorizationService.isPermitted(['admin']), async (req, res) => {
    try {
        const actionUser = await authorizationService.findUserFromHeaders(req.headers);
        await statusService.update(req.params.id, req.body.name, req.body.text, actionUser);

        req.app.get('io').emit('updateData');

        return res.status(200).json({
            message: 'Status updated.',
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
        await statusService.delete(req.params.id, actionUser);

        req.app.get('io').emit('updateData');

        return res.status(200).json({
            message: 'Status deleted.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

module.exports = router;
