const nodemailer = require('nodemailer');
const mailerConst = require('../constants/mailer.const.json');

module.exports = {
    transporter: null,
    init() {
        const auth = mailerConst.secure ? { user: mailerConst.username, pass: mailerConst.password } : null;

        this.transporter = nodemailer.createTransport({
            host: mailerConst.host,
            port: mailerConst.port,
            secure: mailerConst.secure,
            auth,
        });
    },
    async sendMail(to, subject, html) {
        return new Promise((resolve, reject) => {
            if (!this.transporter) {
                this.init();
            }

            this.transporter.sendMail({
                from: '"Quantox Node Test" <test@quantox.com>',
                to,
                subject,
                html,
            }, (error, info) => {
                if (error) {
                    reject(error);
                }

                resolve();
            });
        });
    },
};
