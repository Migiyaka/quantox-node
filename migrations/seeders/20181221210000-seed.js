const bcrypt = require('bcrypt');

const users = require('./json/users.json');
const statuses = require('./json/statuses.json');

module.exports = {
    async up(queryInterface) {
        try {
            const usersToInsert = users.map(user => Object.assign({}, user, {
                password: bcrypt.hashSync(user.password, 10),
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            const statusesToInsert = statuses.map(status => Object.assign({}, status, {
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await queryInterface.bulkInsert('users', usersToInsert, {});
            await queryInterface.bulkInsert('statuses', statusesToInsert, {});

            return true;
        } catch (err) {
            console.log('Error on seeding initial data');
            throw err;
        }
    },
    async down(queryInterface) {
        queryInterface.bulkDelete('users', null, {});
    },
};
