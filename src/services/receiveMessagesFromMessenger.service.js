import { sendMessageOpenAi } from "../connections/openai/sendMessage.js";
import { Chat } from "../models/chat.js";
import { twilioResponse } from "./twilio.js";

export async function receiveMessagesFromMessenger({data}){
  let previousChat = await Chat.findOne({customer_messenger_id: data.psid})
  if(previousChat){
    previousChat.fb_messages.push(
      data.message
    )
    await previousChat.save()
  }
  else{
    previousChat = await Chat.create({
      store: data.store,
      name: data.fullName,
      fb_messages: [data.message],
      customer_messenger_id: data.psid
    })
  }

  if(!previousChat.phone){
    const getPhoneNumber = {
        "type": "function",
        "function": {
          "name": 'getPhoneNumber',
          "description": 'extract the phone number from message. It must convert to a peruvian cellphone (e.g: 51977354389)',
          "parameters": {
            "type": "object",
            "properties": {
              "phone": {
                "type": "number",
                "description": "the cellphone number to extract of the message. It must have 9 digits and starts with 9",
              },
            },
            "required": ["phone"]
          }
        }
      }
    const response = await sendMessageOpenAi({
      messages: previousChat.fb_messages.map((mess)=>{return {role: 'user', content: mess}}),
      chat_functions: [getPhoneNumber],
      first_prompt: {
        role: "system",
        content: "You are a virtual seller of helicoidal suspension automotice springs and need the phone number of your customer to transfer the comunication to whatsapp. That's why, you will ask many kind of questions until he send you his phone number. You must be persuasive and friendly until you get it.",}
    })
    if(response.data.choices[0].message){
      console.log("RESPONSE", response.data.choices[0].message)
      if(response.data.choices[0].message.tool_calls){
        console.log("RESPONSE2", response.data.choices[0].message.tool_calls)
        if(response.data.choices[0].message.tool_calls[0].function.name = 'getPhoneNumber'){
          previousChat.phone_number= `51${JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).phone}`
          const whatsappMessage = `Hola ${previousChat.name}. Soy tu asistente virtual, ¿dime para qué carro estás buscando resortes? (marca, modelo, año, posición y versión).`
          await twilioResponse({To: `'whatsapp:+51910647057'`, From: `whatsapp:+${previousChat.phone_number}`}, whatsappMessage )
          return 'Muchas gracias. En breve te contactaremos al whatsapp '+ JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).phone + '.'
        }
      }else{
        return response.data.choices[0].message.content
      }
    }
  }
}


