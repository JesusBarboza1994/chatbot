import { Chat } from "../models/chat.js";

export async function receiveMessagesFromMessenger({data}){
  //TODO: validar con gpt que ingresa un numero de telofono
  const previousChat = await Chat.findOne({customer_messenger_id: body.psid})
  if(previousChat){
    previousChat.fb_messages.push(
      body.message
    )
  }
  else{
    await Chat.create({
      store: data.store,
      name: data.fullName,
      fb_messages: [data.message],
      customer_messenger_id: data.psid
    })
  }
}