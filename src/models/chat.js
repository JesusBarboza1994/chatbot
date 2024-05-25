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
  phone_number: { type: String, unique: true },
  store: { type: String, required: true },
  name: { type: String },
  messages: [ message_schema ],
  phone: { type: String },
  fb_messages: [{type: String}],
  customer_messenger_id: { type: String },
},{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

export const Chat = mongoose.model('Chat', chat_schema, "chats")