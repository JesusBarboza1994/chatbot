import { Chat } from "../models/chat.js"
import { twilioResponse } from "../services/twilio.js"
export async function responseMessageFromMessenger({response, chat}){
  const messageResponse = response.data.choices[0].message
  if(!messageResponse) return 'Disculpa, por el momento no puedo atenderte. Inténtalo más tarde.'
  console.log("RESPONSE", messageResponse)  
  const toolCalls = messageResponse.tool_calls;
  if (!toolCalls || toolCalls.length === 0) {
    return messageResponse.content;
  }
  console.log("AQUIII")
  const phone_number = `51${JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).phone}`
  const prevChat = await Chat.findOne({phone_number, store: chat.store})
  console.log("🚀 ~ responseMessageFromMessenger ~ prevChat:", prevChat)
  let name = chat.name
  if(prevChat){
    prevChat.fb_messages = chat.fb_messages
    prevChat.customer_messenger_id = chat.customer_messenger_id
    prevChat.name = chat.name
    Chat.deleteOne({store: chat.store, customer_messenger_id: chat.customer_messenger_id})
    prevChat.save()
    
  }else{
    chat.phone_number= `51${JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).phone}`
    chat.save()
  }
  
  const whatsappMessage = `Hola ${name}. Soy tu asistente virtual, ¿dime para qué carro estás buscando resortes? (marca, modelo, año, posición y versión).`
  twilioResponse({To: `whatsapp:+51910647057`, From: `whatsapp:+${phone_number}`}, whatsappMessage )
  
  return 'Muchas gracias. En breve te contactaremos al whatsapp '+ JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).phone + '.'
  
  
}