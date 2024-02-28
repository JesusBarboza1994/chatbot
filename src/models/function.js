import mongoose from "mongoose"

const function_schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  store: { type: String, required: true },
  properties: { type: Object, required: true },
  required: { type: Array },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

export const Function = mongoose.model('Function', function_schema, "functions")