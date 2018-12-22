const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

const routes = require('./routes/routes.js');
const dbConfig = require('./config/db.config.js');

const env = process.env.NODE_ENV || 'development';

dbConfig.init();

app.use(cors({
    credentials: true,
    origin(originURL, callback) {
        if (env === 'development') {
            return callback(null, true);
        }

        return callback(null, false);
    },
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'views/dist')));

app.use('/api', routes);

// error handler
app.use((err, req, res, next) => {
	return res.status(err.status || 500).json({
        error: 'Server error.',
    });
});

module.exports = app;
