import axios from 'axios';
import { askOpenAI } from './utils/openai.js';
import { Chat, Customer } from './model.js';

export function testWebhook(req, res) {
   const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}

export async function receiveMessages(req, res) {
  const token = process.env.WHATSAPP_TOKEN;

  let body = req.body;

  // Check the Incoming webhook message
  console.log("aqui22222222222222",JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if(req.body.entry[0].changes[0].value.messages){

    const text = req.body.entry[0].changes[0].value.messages[0].text.body 
    console.log(text);
    const phone_number = req.body.entry[0].changes[0].value.messages[0].from
    const date = req.body.entry[0].changes[0].value.messages[0].timestamp * 1000
    let customer = await Customer.findOne({ phone_number })
    if(!customer){
      customer = await Customer.create({
        phone_number
      })
    }
    
    await Chat.create({
      customer: customer._id,
      send_by: 'user',
      message: text,
      created_at: new Date(date)
    })
    const response_chat = await askOpenAI(text, customer)

    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        let phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
        axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v12.0/" +
            phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: { body: response_chat },
          },
          headers: { "Content-Type": "application/json" },
        });
      }
      res.sendStatus(200);
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  }
}

