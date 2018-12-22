const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const models = require('../models');
const repository = require('../repositories/sequelizeRepository');
const authorizationConst = require('../constants/authorization.const.json');

const mailService = require('./mailService');

const Sequelize = models.Sequelize;
const sequelize = models.sequelize;
const Op = Sequelize.Op;

const User = models.user;

module.exports = {
    async login(username, password) {
        let foundUser;

        try {
            foundUser = await repository.find(User, {
                [Op.or]: {
                    username: username,
                    email: username,
                },
            });

            if (!foundUser) {
                throw new Error('Wrong username or email. Please try again.');
            }
        } catch (err) {
            throw err;
        }

        const passwordsMatch = await bcrypt.compare(password, foundUser.password);

        if (!passwordsMatch) {
            throw new Error('Wrong password. Please try again.');
        }

        if (!foundUser.active) {
            throw new Error('User not active.');
        }

        return jwt.sign({ id: foundUser.id }, authorizationConst.loginJwtSecret, { expiresIn: 60 * 60 * 24 * 30 });
    },
    async register(firstName, lastName, email, username, password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        let createdUser;

        try {
            createdUser = await repository.create(User, {
                firstName,
                lastName,
                email,
                username,
                password: hashedPassword,
            });
        } catch (err) {
            if (err.message === 'Validation error') {
                throw new Error('User with those credentials already exists.');
            } else {
                throw err;
            }
        }

        try {
            await this.sendRegisteredUserEmail(email, createdUser.id);
        } catch (err) {
            throw new Error('User is created, but activation email couldn\'t be sent.');
        }

        return Promise.resolve();
    },
    async sendRegisteredUserEmail(to, userId) {
        try {
            const token = jwt.sign({
                id: userId,
            }, authorizationConst.activationJwtSecret, {
                expiresIn: 60 * 60 * 24 * 30,
            });

            const title = 'Activate your new profile on Quantox Node Test!';
            const url = `http://localhost:3000/api/authorization/activate/${token}`;
            const html = `Welcome to Quantox Node Test!<br><br>` +
                `Please click <a href="${url}">here</a> to active your profile`;

            await mailService.sendMail(to, title, html);
        } catch (err) {
            throw err;
        }
    },
    async activate(id) {
        try {
            await repository.update(User, { id }, { active: true });
            return Promise.resolve();
        } catch (err) {
            throw err;
        }
    },
    async findUserByToken(token, secretType) {
        let query;

        try {
            const decodedToken = jwt.verify(token, authorizationConst[secretType]);
            query = { id: decodedToken.id };
        } catch (err) {
            throw new Error('Your token is either invalid or expired. Please try logging in again.');
        }

        try {
            return repository.find(User, query, {
                attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'role'],
            });
        } catch (err) {
            throw err;
        }
    },
    async findUserFromHeaders(headers) {
        if (headers.authorization && headers.authorization.indexOf(' ') >= 0) {
            try {
                const token = headers.authorization.split(' ')[1];
                return this.findUserByToken(token, 'loginJwtSecret');
            } catch (err) {
                throw err;
            }
        }
    },
    isPermitted(permittedRoles) {
        return async (req, res, next) => {
            try {
                const decodedUser = await this.findUserFromHeaders(req.headers);

                if (!decodedUser || permittedRoles.indexOf(decodedUser.role) < 0) {
                    return res.status(500).json({
                        error: 'Unauthorized!',
                    });
                }

                return next();
            } catch (err) {
                return res.status(500).json({
                    error: 'Unauthorized!',
                });
            }
        };
    },
};
