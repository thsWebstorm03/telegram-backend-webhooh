const dotenv = require("dotenv");
dotenv.config();
const cors = require('cors');

const express = require("express");
const axios = require( "axios");
const app = express();
app.use(express.json());
app.use(cors());

// Create a telegram bot with its API KEY
const trelloAPIKey = process.env.TRELLO_API_KEY;
const trelloToken = process.env.TRELLO_API_TOKEN;
const callbackURL = 'https://telegram-trello-webhook.onrender.com/trello-callback';
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

app.get("/", (req, res) => {
   return res.send("Hello")
})

app.post("/trello-callback", (req, res) => {
   // Check if it's a card move event
   // console.log(req.body, 'req.body');
   // return res.json({
   //    trelloAPIKey: trelloAPIKey,
   //    text:"OK"
   // });
   // if (
   //    req.body.action.type === "updateCard" &&
   //    req.body.action.data.listAfter
   // ) {
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
   // }

   return res.status(200).send("OK");
});

// createTrelloWebhook();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));