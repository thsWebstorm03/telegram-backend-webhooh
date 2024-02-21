// const Sequelize = require("sequelize");
const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

let db = process.env.DB_NAME;
let user = process.env.DB_USER;
let pass = process.env.DB_PASS;
let host = process.env.DB_HOST;

const sequelize = new Sequelize(db, user, pass, {
	dialect: "mysql",
	host,
});

// module.exports = sequelize;
export default sequelize;