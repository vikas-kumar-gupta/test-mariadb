const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sample", "root", "Myadmin", {
    host: "localhost",
    dialect: "mariadb",
  });

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type : DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type : DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "user",
  }
);

module.exports = User;