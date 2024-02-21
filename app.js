const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(cors());

const Data = require("./Data");
const {formatDateDifference} = require("./helper");

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
   console.log(req.body, "req.body--");

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

         const user_data = await Data.findAll({
            where:{
               "trello_card_id": cardId
            }
         });

         try {
            const startDate = new Date(user_data[0]['created_at']);
            const endDate = new Date();

            const updated_result = await Data.update({ finished_at: endDate }, {
               where: {
                  trello_card_id: cardId
               }
            });

            
            // // Calculate the difference in milliseconds
            // const differenceInMilliseconds = endDate - startDate;

            // // Convert the difference to various units
            // const differenceInSeconds = parseInt(differenceInMilliseconds / 1000);
            // const differenceInMinutes = parseInt(differenceInSeconds / 60);
            // const differenceInHours = parseInt(differenceInMinutes / 60);
            // const differenceInDays = parseInt(differenceInHours / 24);
            
            var difference = formatDateDifference(startDate, endDate);
            console.log(updated_result, 'updated_result-----------'); // Result will show the number of rows affected
            console.log(difference, 'difference-----------');

         } catch (error) {
            console.error('Error updating user:', error);
         }

         console.log(user_data, 'user_data---------');

         if(user_data.length>0){
            let user_chat_id = user_data[0]['telegram_id'];
            if (attachmentsResponse.data) {
               // console.log(attachmentsResponse, 'at');
               attachmentsResponse.data.map((item, i) =>
                  sendMessage(
                     user_chat_id,
                     `New notification arrived from Trello\n Finished Video ${i + 1} - ${item.url}\nDuration: ${difference}`
                  )
               );
               // console.log(videoURLs, 'vi')
            }
         }

         // if (cardResponse.data) {
         //    const cardDescription = cardResponse.data.desc;
         //    const jsonData = JSON.parse(cardDescription);
         //    const user_chat_id =
         //       Object.keys(jsonData).indexOf("chatId") > -1
         //          ? jsonData.chatId
         //          : "6456284057";

         //    console.log(user_chat_id, 'user_chat_id');

         //    if (attachmentsResponse.data) {
         //       // console.log(attachmentsResponse, 'at');
         //       attachmentsResponse.data.map((item, i) =>
         //          sendMessage(
         //             user_chat_id,
         //             `New notification arrived from Trello\n Finished Video ${i + 1} - ${item.url}`
         //          )
         //       );
         //       // console.log(videoURLs, 'vi')
         //    }
         // }
      } catch (error) {
         console.error("Error processing Trello card:", error);
      }

   }

   return res.send("Hello");
});

// createTrelloWebhook();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
