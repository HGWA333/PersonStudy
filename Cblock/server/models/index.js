"use strict";

const Sequelize = require("sequelize");
const process = require("process");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const LastBlock = require("./block");
const LastTransaction = require("./transaction");

const db = { LastBlock, LastTransaction };

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

LastBlock.init(sequelize);
LastTransaction.init(sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
