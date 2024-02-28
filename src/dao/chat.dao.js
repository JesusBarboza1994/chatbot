import { Chat } from "../models/chat.js"
async function createOrUpdateChat({phone_number, text, date, store}){
 let chat = await Chat.findOne({ phone_number, store })
 if(!chat){
   chat = await Chat.create({
     phone_number,
     store,
     messages: [{
       created_at: new Date(date),
       role: 'user',
       content: text
     }]
   })
 }else{
   chat.messages.push({
     role: 'user',
     content: text
   })
   await chat.save()
 }
 return chat
}

export default {
  createOrUpdateChat
}