import { sendMessageOpenAi } from "../connections/openai/sendMessage.js";
import { Chat } from "../models/chat.js";

export async function receiveMessagesFromMessenger({data}){
  //TODO: validar con gpt que ingresa un numero de telofono
  let previousChat = await Chat.findOne({customer_messenger_id: data.psid})
  if(previousChat){
    previousChat.fb_messages.push(
      data.message
    )
  }
  else{
    previousChat = await Chat.create({
      store: data.store,
      name: data.fullName,
      fb_messages: [data.message],
      customer_messenger_id: data.psid
    })
  }

  if(previousChat.phone){
    const getPhoneNumber = {
        "type": "function",
        "function": {
          "name": 'getPhoneNumber',
          "description": 'extract the phone number from message',
          "parameters": {
            "type": "object",
            "properties": {
              "phone": {
                "type": "string",
                "description": "the phone number to extract of the message. It must convert to a peruvian cellphone (e.g: 51977354389) "
              },
            },
            "required": ["phone"]
          }
        }
      }
    const response = await sendMessageOpenAi({
      messages: previousChat.fb_messages,
      chat_functions: [getPhoneNumber],
    })
    console.log("RESPONSE", response)
  }

  
}

