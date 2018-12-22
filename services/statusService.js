const models = require('../models');
const repository = require('../repositories/sequelizeRepository');

const Status = models.status;
const User = models.user;

module.exports = {
    async findByName(name) {
        try {
            return repository.find(Status, { name });
        } catch (err) {
            throw err;
        }
    },
    async findById(id) {
        try {
            return repository.find(Status, { id });
        } catch (err) {
            throw err;
        }
    },
    async findAll() {
        try {
            return repository.findAll(Status, {}, {
                include: [
                    { model: User, as: 'creator' },
                ],
                order: [['id', 'ASC']],
            });
        } catch (err) {
            throw err;
        }
    },
    async create(name, text, creatorId) {
        try {
            await repository.create(Status, {
                name,
                text,
                creatorId,
            });

            return Promise.resolve();
        } catch (err) {
            if (err.message === 'Validation error') {
                throw new Error('A status with that name already exists.');
            } else {
                throw err;
            }
        }
    },
    async update(id, name, text, actionUser) {
        try {
            const foundStatus = await this.findById(id);

            if (!foundStatus.editable) {
                throw new Error('This status is not editable.');
            } else if (actionUser.role === 'admin') {
                await repository.update(Status, { id }, {
                    name,
                    text,
                });

                return Promise.resolve();
            } else {
                throw new Error('Only an admin can update a status.');
            }
        } catch (err) {
            throw err;
        }
    },
    async delete(id, actionUser) {
        try {
            const foundStatus = await this.findById(id);

            if (!foundStatus.editable) {
                throw new Error('This status is not editable.');
            } else if (actionUser.role === 'admin') {
                await repository.delete(Status, { id });
                return Promise.resolve();
            } else {
                throw new Error('Only an admin can delete a status.');
            }
        } catch (err) {
            throw err;
        }
    }
};
