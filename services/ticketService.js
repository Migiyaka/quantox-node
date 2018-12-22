const models = require('../models');
const repository = require('../repositories/sequelizeRepository');
const statusService = require('./statusService');
const historyService = require('./historyService');

const Ticket = models.ticket;
const User = models.user;
const Status = models.status;

module.exports = {
    async findAll() {
        try {
            return repository.findAll(Ticket, {}, {
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'active'],
                    },
                    {
                        model: User,
                        as: 'assignee',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'active'],
                    },
                    { model: Status },
                ],
                order: [['id', 'ASC']],
            });
        } catch (err) {
            throw err;
        }
    },
    async find(id) {
        try {
            return repository.find(Ticket, { id }, {
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'active'],
                    },
                    {
                        model: User,
                        as: 'assignee',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'active'],
                    },
                    { model: Status },
                ],
            });
        } catch (err) {
            throw err;
        }
    },
    async create(title, content, creatorId, assigneeId) {
        try {
            const pendingStatus = await statusService.findByName('pending');

            await repository.create(Ticket, {
                title,
                content,
                creatorId,
                assigneeId,
                statusId: pendingStatus ? pendingStatus.id : null,
            }, {
                userId: creatorId,
            });

            return Promise.resolve();
        } catch (err) {
            throw err;
        }
    },
    async update(id, title, content, assigneeId, actionUser) {
        try {
            const foundTicket = await repository.find(Ticket, { id });

            if (foundTicket.creatorId === actionUser.id || actionUser.role === 'admin') {
                await repository.update(Ticket, { id }, {
                    title,
                    content,
                    assigneeId,
                }, {
                    userId: actionUser.id,
                });

                return Promise.resolve();
            } else {
                throw new Error('Only the ticket creator or an admin can update a ticket.');
            }
        } catch (err) {
            throw err;
        }
    },
    async updateStatus(id, statusId, actionUser) {
        try {
            const foundTicket = await repository.find(Ticket, { id });

            if (foundTicket.assigneeId === actionUser.id || actionUser.role === 'admin') {
                await repository.update(Ticket, { id }, {
                    statusId,
                }, {
                    userId: actionUser.id,
                });

                return Promise.resolve();
            } else {
                throw new Error('Only the ticket assignee or an admin can update a ticket status.');
            }
        } catch (err) {
            throw err;
        }
    },
    async delete(id, actionUser) {
        try {
            const foundTicket = await repository.find(Ticket, { id });

            if (actionUser.role === 'admin') {
                await repository.delete(Ticket, { id }, { userId: actionUser.id });
                return Promise.resolve();
            } else if (foundTicket.creatorId === actionUser.id ) {
                await repository.archive(Ticket, { id }, { userId: actionUser.id });
                return Promise.resolve();
            } else {
                throw new Error('Only ticket creator or an admin can delete a ticket.');
            }
        } catch (err) {
            throw err;
        }
    },
};
