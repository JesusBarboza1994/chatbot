import { sendMessageOpenAi } from "../connections/openai/sendMessage.js";
import { Chat } from "../models/chat.js";

export async function receiveMessagesFromMessenger({data}){
  //TODO: validar con gpt que ingresa un numero de telofono
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
    console.log("DATA", previousChat.fb_messages)
    const response = await sendMessageOpenAi({
      messages: previousChat.fb_messages.map(mess => {return {role: 'user', content: mess}}),
      chat_functions: [getPhoneNumber],
      first_prompt: ''
    })
    console.log("RESPONSE", response)
  }

  
}

