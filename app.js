const express = require("express");
const app = express();
const { Sequelize, Model, DataTypes } = require("sequelize");

// const User = require("./models/user.js");
// const UserDetail = require("./models/user_detail");

const port = 3000;

app.use(express.json());

// database connection
const sequelize = new Sequelize("sample", "root", "Myadmin", {
  host: "localhost",
  dialect: "mariadb",
});

// testing the database connection
let testDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
testDBConnection();

// user model creation and intialization extending model

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

// userdetail model creation using .define

const UserDetail = sequelize.define("user_detail", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

//  creating foreign key
UserDetail.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

app.get("/user/:username", async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ where: { username: username } });
  const userDetail = await UserDetail.findOne({ where: { user_id: user.id } })
  if (user === null) {
    res.send("User not found");
  } else {
    res.send({user, userDetail});
  }
});

app.get("/users-list", async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "username", "password"],
  });
  if (users === null) {
    res.send("User not found");
  } else {
    res.send(users);
  }
});

app.post("/sign-up", async (req, res) => {
  await sequelize.sync();
  let { username, password, firstName, lastName, phoneNumber } = req.body;
  const user = await User.create({ username: username, password: password });
  const userDetail = await UserDetail.create({
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    user_id: user.id,
  });
  res.send("Data updated");
});

app.post("/log-in", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    where: { username: username, password: password },
  });
  if (user === null) {
    res.send("User not found");
  } else {
    res.send(user);
  }
});

app.delete("/user/:username/delete", async (req, res) => {
  const username = req.params.username;
  const user = await User.destroy({ where: { username: username } })
    .then(function (deletedRecord) {
      if (deletedRecord === 1) {
        res.status(200).json({ message: "Deleted successfully" });
      } else {
        res.status(404).json({ message: "record not found" });
      }
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
});

app.put("/user/:username/edit", async (req, res) => {
  let { username, firstName, lastName, phoneNumber } = req.body;
  const user = await User.findOne({ where: { username: username } });
  const userDetail = await UserDetail.findOne({
    where: { user_id: user.id },
  })
    .then((data) => {
      return data.update({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      });
    })
    .catch((err) => {
      res.send("data not found");
      console.log(err);
    });
  res.send("data updated");
  console.log(userDetail);
});

app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`);
});
