module.exports = (sequelize, DataTypes) => sequelize.define('revision', {
    model: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    document: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    documentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    revision: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});
