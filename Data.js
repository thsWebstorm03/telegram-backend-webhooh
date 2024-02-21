import Sequelize from "sequelize";
import sequelize from "./database.js";

const Data = sequelize.define(
	"video_logs",
	{
      telegram_id: Sequelize.STRING,
		trello_card_id: Sequelize.STRING,
		user_name: Sequelize.STRING,
		first_name: Sequelize.STRING,
      video_url: Sequelize.STRING,
		video_count: Sequelize.INTEGER,
      label: Sequelize.STRING,
      request_type: Sequelize.STRING,
      created_at: Sequelize.DATE,
      finished_at:Sequelize.DATE,
	},
	{
		timespamps: false,
		createdAt: false,
		updatedAt: false,
	}
);

// module.exports = Data;
export default Data;
