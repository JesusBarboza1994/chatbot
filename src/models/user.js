import mongoose from "mongoose"

const user_schema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  phone_number: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  store: { type: String, required: true, unique: true },
  database_type: {
    type: String,
    enum: ['mongo', 'excel'],
    default: 'mongo'
  },
  prompt: { type: String, required: true },
})

export const User = mongoose.model('User', user_schema, "users")