import { sendResponseToWhatsapp } from "../components/whatsapp/utils/sendResponseToWhatsapp.js"
import { ChatDao } from "../dao/index.js"
import { chatWithGPT } from "./chatWithGPT.js"
import twilio from 'twilio';

export async function twilioService({body, store}){
  if(body.MessageType !== "text"){
    console.log("No hay texto")
    const only_text = 'Por el momento no puedo reconocer audios, videos ni imágenes. Por favor enviáme tus requerimientos por escrito.'
    await twilioResponse(body, only_text)
    return ({code: 404, message: only_text})
  }

  const chat = await ChatDao.createOrUpdateChat({
    phone_number: body.WaId,
    text: body.Body,
    date: new Date,
    store 
  })
  let response_chat = await chatWithGPT({chat, store})

  console.log("🚀 ~ receiveMessagesFromWhatsapp ~ response_chat:", response_chat)
  if(response_chat === 'Su pedido ha sido creado exitosamente. Muchas gracias.'){
    console.log("Enviando mensaje de pedido a vendedor...")
    await twilioResponse(body, response_chat, "51966344009")
  }
  await twilioResponse(body, response_chat)
  return response_chat
}

async function twilioResponse(body, response_chat, phone_number){
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_ID;
    const authToken = process.env.TWILIO_TOKEN
    const client = twilio(accountSid, authToken);

    try {
      await client.messages.create({
        body: response_chat,
        from: body.To,
        to: phone_number || body.From
      })
    } catch (error) {
      console.log("RESPONSE WHATSAPP TWILIO", error)   
    }
   
  } catch (error) {
    console.log("ERROR",error)
    throw error
  }
}