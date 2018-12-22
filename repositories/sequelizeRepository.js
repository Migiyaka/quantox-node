const models = require('../models');

const Sequelize = models.Sequelize;
const sequelize = models.sequelize;
const Op = Sequelize.Op;

module.exports = {
    async find(model, query, options) {
        return model.findOne(Object.assign({}, { where: query }, options));
    },
    async findAll(model, query, options) {
        return model.findAll(Object.assign({}, { where: query }, options));
    },
    async create(model, data, options) {
        return model.create(data, options);
    },
    async update(model, query, data, options) {
        return model.update(data, Object.assign({}, {
            where: query,
            individualHooks: true,
        }, options));
    },
    async archive(model, query, options) {
        return model.destroy(Object.assign({}, {
            where: query,
        }, options));
    },
    async delete(model, query, options) {
        return model.destroy(Object.assign({}, {
            where: query,
            force: true,
        }, options));
    },
};
