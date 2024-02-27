import axios from 'axios';
import { Chat } from '../../models/chat.js';
import { queryDataBase } from './utils/queryDatabase.js';
import { sendResponseToWhatsapp } from './utils/sendResponseToWhatsapp.js';
import { response } from 'express';
import { askOpenAI } from '../openai/utils/functionOpenAi.js';

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
  let body = req.body;

  // Valida si está llegando un nuevo mensaje y no los estados de los mensajes anteriores.
  if(req.body.entry[0].changes[0].value.messages){
    console.log("WSP TEXT", req.body.entry[0].changes[0].value.messages[0].text)
    if(!req.body.entry[0].changes[0].value.messages[0].text){
      console.log("No hay texto")
      const only_text = 'Por el momento no puedo reconocer audios, videos ni imágenes. Por favor enviáme tus requerimientos por escrito.'
      sendResponseToWhatsapp(body, only_text)
      return res.sendStatus(404);
    }
    const text = req.body.entry[0].changes[0].value.messages[0].text.body 
    const phone_number = req.body.entry[0].changes[0].value.messages[0].from
    const date = req.body.entry[0].changes[0].value.messages[0].timestamp * 1000
    
    let chat = await Chat.findOne({ phone_number })
    if(!chat){
      chat = await Chat.create({
        phone_number,
        messages: [{
          created_at: new Date(date),
          role: 'user',
          content: text
        }]
      })
    }else{
      chat.messages.push({
        role: 'user',
        content: text
      })
      await chat.save()
    }
    
    let response_chat = await askOpenAI(chat)
    
    try {
      if(response_chat === `Su pedido ha sido creado exitosamente. Muchas gracias.`){
        console.log("Enviando mensaje de pedido a vendedor...")
        await sendResponseToWhatsapp(body, response_chat, "51966344009")
      }
      await sendResponseToWhatsapp(body, response_chat)
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(404);
    }
    
  }
}


