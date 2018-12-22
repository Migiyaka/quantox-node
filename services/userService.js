const jwt = require('jsonwebtoken');

const models = require('../models');
const repository = require('../repositories/sequelizeRepository');

const User = models.user;

module.exports = {
    async findAll() {
        try {
            return repository.findAll(User, {
                role: {
                    [models.Sequelize.Op.not]: 'admin',
                },
            }, {
                attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'active'],
                order: [['id', 'ASC']],
            });
        } catch (err) {
            throw err;
        }
    },
    async delete(id, actionUser) {
        try {
            if (actionUser.role === 'admin') {
                await repository.delete(User, { id });
                return Promise.resolve();
            } else {
                throw new Error('Only an admin can delete a user.');
            }
        } catch (err) {
            throw err;
        }
    },
};
