import { Chat } from "../models/chat.js"

export async function responseMessageFromMessenger({response, chat}){
  if(!response.data.choices[0].message) return 'Disculpa, por el momento no puedo atenderte. Inténtalo más tarde.'
  console.log("RESPONSE", response.data.choices[0].message)  
  if(!(response.data.choices[0].message?.tool_calls[0].function.name = 'getPhoneNumber')) return response.data.choices[0].message.content  
  const phone_number = `51${JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).phone}`
  const prevChat = await Chat.findOne({phone_number, store: chat.store})
  console.log("🚀 ~ responseMessageFromMessenger ~ prevChat:", prevChat)
  let name = chat.name
  if(prevChat){
    prevChat.fb_messages = chat.fb_messages
    prevChat.customer_messenger_id = chat.customer_messenger_id
    prevChat.name = chat.name
    prevChat.save()
    chat.remove()
  }else{
    chat.phone_number= `51${JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).phone}`
    chat.save()
  }
  
  const whatsappMessage = `Hola ${name}. Soy tu asistente virtual, ¿dime para qué carro estás buscando resortes? (marca, modelo, año, posición y versión).`
  twilioResponse({To: `'whatsapp:+51910647057'`, From: `whatsapp:+${phone_number}`}, whatsappMessage )
  
  return 'Muchas gracias. En breve te contactaremos al whatsapp '+ JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).phone + '.'
  
  
}