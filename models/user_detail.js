const { Sequelize, Model, DataTypes } = require("sequelize");
const User = require("./user");
const sequelize = new Sequelize("sample", "root", "Myadmin", {
  host: "localhost",
  dialect: "mariadb",
});

const UserDetail = sequelize.define('UserDetail', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

//  creating foreign key
UserDetail.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});

module.exports = UserDetail;