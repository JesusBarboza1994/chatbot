import { sendResponseToWhatsapp } from "../components/whatsapp/utils/sendResponseToWhatsapp.js"
import { ChatDao } from "../dao/index.js"
import { Order } from "../models/order.js";
import { User } from "../models/user.js";
import { chatWithGPT } from "./chatWithGPT.js"
import twilio from 'twilio';

export async function twilioService({body, message, store}){
  if(body.MessageType !== "text"){
    console.log("No hay texto")
    const only_text = 'Por el momento no puedo reconocer audios, videos ni imágenes. Por favor enviáme tus requerimientos por escrito.'
    await twilioResponse(body, only_text)
    return ({code: 404, message: only_text})
  }

  const chat = await ChatDao.createOrUpdateChat({
    phone_number: body.WaId,
    text: message,
    date: new Date,
    store 
  })
  let response_chat = await chatWithGPT({chat, store})

  console.log("🚀 ~ receiveMessagesFromWhatsapp ~ response_chat:", response_chat)
  if(response_chat === 'Su pedido ha sido creado exitosamente. Muchas gracias.'){
    const order = await Order.findOne({phone_number: body.WaId}).sort({created_at: -1}).limit(1)
    const user = await User.findOne({store})
    const new_response = `Hola, te informamos que el cliente ${order.phone_number} quiero adquirir ${order.quantity} del código ${order.osis_code}. Contáctate con él para gestionar la compra.`
    await twilioResponse(body, new_response, `whatsapp:+${user.phone_number}`)
  }
  await twilioResponse(body, response_chat)
  return response_chat
}

export async function twilioResponse(body, response_chat, phone_number){
  try {
    console.log("BODY TWILIO", body)
    const accountSid = process.env.TWILIO_ACCOUNT_ID;
    const authToken = process.env.TWILIO_TOKEN
    const client = twilio(accountSid, authToken);

    try {
      const response = await client.messages.create({
        body: response_chat,
        from: body.To,
        to: phone_number || body.From
      })
      console.log("RES", response)
    } catch (error) {
      console.log("RESPONSE WHATSAPP TWILIO", error)   
    }
   
  } catch (error) {
    console.log("ERROR",error)
    throw error
  }
}