const socketIO = require('socket.io');

module.exports = {
    init(server, app) {
        const io = socketIO.listen(server);
        app.set('io', io);
    },
};
