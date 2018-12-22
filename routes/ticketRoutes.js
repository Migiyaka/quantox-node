const express = require('express');

const ticketService = require('../services/ticketService');
const authorizationService = require('../services/authorizationService');
const historyService = require('../services/historyService');

const router = express.Router();

router.get('/', authorizationService.isPermitted(['user', 'admin']), async (req, res) => {
    try {
        const ticketList = await ticketService.findAll();

        return res.status(200).json({
            list: ticketList,
            message: 'Tickets found.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.post('/', authorizationService.isPermitted(['user', 'admin']), async (req, res) => {
    try {
        const actionUser = await authorizationService.findUserFromHeaders(req.headers);
        await ticketService.create(req.body.title, req.body.content, actionUser.id, req.body.assigneeId);

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

router.get('/:id', authorizationService.isPermitted(['user', 'admin']), async (req, res) => {
    try {
        const ticket = await ticketService.find(req.params.id);

        return res.status(200).json({
            ticket,
            message: 'Ticket found.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.patch('/:id', authorizationService.isPermitted(['user', 'admin']), async (req, res) => {
    try {
        const actionUser = await authorizationService.findUserFromHeaders(req.headers);
        await ticketService.update(req.params.id, req.body.title, req.body.content, req.body.assigneeId, actionUser);

        req.app.get('io').emit('updateData');

        return res.status(200).json({
            message: 'Ticket updated.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.patch('/:id/status', authorizationService.isPermitted(['user', 'admin']), async (req, res) => {
    try {
        const actionUser = await authorizationService.findUserFromHeaders(req.headers);
        await ticketService.updateStatus(req.params.id, req.body.statusId, actionUser);

        req.app.get('io').emit('updateData');

        return res.status(200).json({
            message: 'Ticket status updated.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.delete('/:id', authorizationService.isPermitted(['user', 'admin']), async (req, res) => {
    try {
        const actionUser = await authorizationService.findUserFromHeaders(req.headers);
        await ticketService.delete(req.params.id, actionUser);

        req.app.get('io').emit('updateData');

        return res.status(200).json({
            message: 'Ticket deleted.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

router.get('/:id/history', authorizationService.isPermitted(['user', 'admin']), async (req, res) => {
    try {
        const history = await historyService.getHistory('ticket', req.params.id);

        return res.status(200).json({
            history,
            message: 'Ticket history found.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

module.exports = router;
