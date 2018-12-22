module.exports = (sequelize, DataTypes) => sequelize.define('status', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    editable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    paranoid: true,
});
