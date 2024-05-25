import { sendMessageOpenAi } from "../connections/openai/sendMessage.js";
import { Chat } from "../models/chat.js";

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
      messages: [{
        role: 'user',
        content: previousChat.fb_messages[previousChat.fb_messages.length - 1]
      }],
      chat_functions: [getPhoneNumber],
      first_prompt: {
        role: "system",
        content: "You are a virtual seller of helicoidal suspension automotice springs and need the phone number of your customer to transfer the comunication to whatsapp."}
    })
    if(response.data.choices[0].message){
      console.log("RESPONSE", response.data.choices[0].message)
      if(response.data.choices[0].message.tool_calls){
        console.log("RESPONSE2", response.data.choices[0].message.tool_calls)
        if(response.data.choices[0].message.tool_calls[0].function.name = 'getPhoneNumber'){
          // TODO: Enviar un mensaje de whatsapp al numero.
          return 'Muchas gracias. En breve te contactaremos al whatsapp '+ response.data.choices[0].message.tool_calls[0].function.arguments.phone + '.'
        }
      }else{
        return response.data.choices[0].message.content
      }
    }
  }
}


