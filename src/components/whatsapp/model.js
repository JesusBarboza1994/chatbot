import mongoose from "mongoose";

const customer_schema = new mongoose.Schema({
  phone_number: { type: String, required: true, unique: true },
  name: { type: String },
})

const chat_schema = new mongoose.Schema({
  customer:  { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  created_at: { type: Date, default: Date.now },
  role:{
    type: String,
    enum: ["user", "system"],
    default: 'user'
  },
  message: { type: String, required: true },
})

export const Customer = mongoose.model('Customer', customer_schema, "customers")
export const Chat = mongoose.model('Chat', chat_schema, "chats")