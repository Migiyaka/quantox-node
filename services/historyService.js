const { diff } = require('deep-object-diff');

const repository = require('../repositories/sequelizeRepository');
const models = require('../models');

const Revision = models.revision;
const Ticket = models.Ticket;

module.exports = {
    async getHistory(model, modelId) {
        try {
            const history = await repository.findAll(Revision, {
                [models.Sequelize.Op.and]: {
                    model,
                    documentId: parseInt(modelId),
                },
            },{
                raw: true,
                order: [['revision', 'ASC']],
            });

            const historyChanges = history.map((historyItem, historyIndex) => {
                if (historyIndex > 0) {
                    const currentValue = JSON.parse(historyItem.document);
                    const previousValue = JSON.parse(history[historyIndex - 1].document);

                    return Object.assign({}, historyItem, {
                        change: diff(previousValue, currentValue),
                    });
                } else {
                    return historyItem;
                }
            });

            return historyChanges;
        } catch (err) {
            throw err;
        }
    },
};
