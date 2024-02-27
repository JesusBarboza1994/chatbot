import { sendResponseToWhatsapp } from "../../whatsapp/utils/sendResponseToWhatsapp.js"
import { ChatDao } from "../dao/index.js"
import { chatWithGPT } from "./chatWithGPT.js"
export async function receiveMessagesFromWhatsapp({body}) {
  if(!body.entry[0].changes[0].value.messages[0].text){
    console.log("No hay texto")
    const only_text = 'Por el momento no puedo reconocer audios, videos ni imágenes. Por favor enviáme tus requerimientos por escrito.'
    await sendResponseToWhatsapp(body, only_text)
    return ({code: 404, message: only_text})
  }

  const refactor_body= body.entry[0].changes[0].value.messages[0]
  const text = refactor_body.text.body 
  const phone_number = refactor_body.from || "pruebasss"
  const date = refactor_body.timestamp * 1000 || new Date()
  
  const chat = await ChatDao.createOrUpdateChat({phone_number, text, date})

  let response_chat = await chatWithGPT({chat})   
  if(response_chat === 'Su pedido ha sido creado exitosamente. Muchas gracias.'){
    console.log("Enviando mensaje de pedido a vendedor...")
    await sendResponseToWhatsapp(body, response_chat, "51966344009")
  }
  await sendResponseToWhatsapp(body, response_chat)
 
    
}