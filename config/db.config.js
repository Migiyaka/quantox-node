const paperTrail = require('sequelize-paper-trail');

const models = require('../models');

const User = models.user;
const Ticket = models.ticket;
const Status = models.status;

module.exports = {
    async init() {
        Ticket.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });
        Ticket.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });
        Ticket.belongsTo(Status);

        Status.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });

        const PaperTrail = paperTrail.init(models.sequelize, {
            userModel: 'user',
            revisionModel: 'revision',
            exclude: ['id', 'createdAt', 'updatedAt', 'revision'],
        });

        PaperTrail.defineModels({});

        Ticket.hasPaperTrail();

        await models.sequelize.sync({});
    },
};
