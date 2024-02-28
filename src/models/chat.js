import mongoose from "mongoose";

const message_schema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  role:{
    type: String,
    enum: ["user", "system", "assistant"],
    default: 'user'
  },
  content: { type: String, required: true },
})

const chat_schema = new mongoose.Schema({
  phone_number: { type: String, required: true, unique: true },
  store: { type: String, required: true },
  name: { type: String },
  messages: [ message_schema ]
})

export const Chat = mongoose.model('Chat', chat_schema, "chats")