// const Sequelize = require("sequelize");
import Sequelize from "sequelize";

let db = "trello_db";
let user = "root";
let pass = "iamattila01A!";
let host = "66.29.130.114";

const sequelize = new Sequelize(db, user, pass, {
	dialect: "mysql",
	host,
});

// module.exports = sequelize;
export default sequelize;