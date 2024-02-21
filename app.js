const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(cors());

// Create a telegram bot with its API KEY
const trelloAPIKey = process.env.TRELLO_API_KEY;
const trelloToken = process.env.TRELLO_API_TOKEN;
const callbackURL = "https://telegram-trello-webhook.onrender.com/";
const boardID = process.env.TRELLO_BOARD_ID;

async function createTrelloWebhook() {
   try {
      const response = await axios.post("https://api.trello.com/1/webhooks", {
         key: trelloAPIKey,
         token: trelloToken,
         callbackURL: callbackURL,
         idModel: boardID,
      });
      console.log("Webhook created successfully:", response.data);
   } catch (error) {
      console.error("Error creating webhook:", error);
   }
}

// app.get("/", (req, res) => {
//    return res.send("Hello")
// })

async function sendVideo(chatId, videoUrl, caption) {
   try {
      const response = await axios.post(
         `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendVideo`,
         {
            chat_id: chatId,
            video: videoUrl,
            caption: caption,
         }
      );
      console.log("Video sent successfully", response.data);
   } catch (error) {
      console.error("Error sending video", error);
   }
}

async function sendMessage(chatId, text) {
   try {
      const response = await axios.post(
         `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
         {
            chat_id: chatId,
            text: text,
         }
      );
      console.log("Video sent successfully", response.data);
   } catch (error) {
      console.error("Error sending video", error);
   }
}

app.post("/", async (req, res) => {
   // Check if it's a card move event
   console.log(req.body, "req.body");

   if (
      req?.body?.action?.type === "updateCard" &&
      req?.body?.action?.data?.listAfter &&
      req?.body?.action?.data?.listAfter?.name == "Finished"
   ) {
      const cardTitle = req.body.action.data.card.name;
      const listname = req.body.action.data.listAfter.name;
      const cardId = req.body.action.data.card.id;

      const videoURLs = [];
      try {
         // Fetch attachments from Trello
         const attachmentsResponse = await axios.get(
            `https://api.trello.com/1/cards/${cardId}/attachments?key=${trelloAPIKey}&token=${trelloToken}`
         );
         const cardResponse = await axios.get(
            `https://api.trello.com/1/cards/${cardId}?key=${trelloAPIKey}&token=${trelloToken}`
         );

         if (cardResponse.data) {
            const cardDescription = cardResponse.data.desc;
            const jsonData = JSON.parse(cardDescription);
            const user_chat_id =
               Object.keys(jsonData).indexOf("chatId") > -1
                  ? jsonData.chatId
                  : "6456284057";

            console.log(user_chat_id, 'user_chat_id');

            if (attachmentsResponse.data) {
               // console.log(attachmentsResponse, 'at');
               attachmentsResponse.data.map((item, i) =>
                  sendMessage(
                     user_chat_id,
                     `New notification arrived from Trello\n Finished Video ${i + 1} - ${item.url}`
                  )
               );
               // console.log(videoURLs, 'vi')
            }
         }
      } catch (error) {
         console.error("Error processing Trello card:", error);
      }

      // Send message to Telegram
      // axios
      //    .post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      //       chat_id: "6456284057",
      //       text: `A card ${cardTitle} has been moved to the list ${listname} on Trello!`,
      //    })
      //    .then((response) => {
      //       // Handle success
      //       console.log("Successfully sent message");
      //    })
      //    .catch((error) => {
      //       // Handle error
      //       console.log("Error in sending a message", error)
      //    });
   }

   return res.send("Hello");
});

// createTrelloWebhook();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
