const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const axios = require( "axios");
const app = express();
app.use(express.json());

// Create a telegram bot with its API KEY
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const trelloAPIKey = process.env.TRELLO_API_KEY;
const trelloToken = process.env.TRELLO_API_TOKEN;
const callbackURL = 'http://66.29.130.114/trello-callback';
const boardID = process.env.TRELLO_BOARD_ID;

async function createTrelloWebhook() {

   try {
       const response = await axios.post('https://api.trello.com/1/webhooks', {
           key: trelloAPIKey,
           token: trelloToken,
           callbackURL: callbackURL,
           idModel: boardID
       });
       console.log('Webhook created successfully:', response.data);
   } catch (error) {
       console.error('Error creating webhook:', error);
   }
}

app.post("/trello-callback", (req, res) => {
   // Check if it's a card move event
   console.log(req.body, 'req.body');
   return res.json({
      token: token,
      text:"OK"
   });
   if (
      req.body.action.type === "updateCard" &&
      req.body.action.data.listAfter
   ) {
      // Send message to Telegram
      axios
         .post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: "6456284057",
            text: "A card has been moved on Trello!",
         })
         .then((response) => {
            // Handle success
            console.log("Successfully sent message");
         })
         .catch((error) => {
            // Handle error
            console.log("Error in sending a message", error)
         });
   }

   res.status(200).send("OK");
});

createTrelloWebhook();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));