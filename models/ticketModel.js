module.exports = (sequelize, DataTypes) => sequelize.define('ticket', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    paranoid: true,
});
