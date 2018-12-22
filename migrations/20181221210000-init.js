const dbConfig = require('../config/db.config');

module.exports = {
    async up() {
        await dbConfig.init();
    },
    async down(queryInterface) {
        queryInterface.dropAllTables();
    },
};
