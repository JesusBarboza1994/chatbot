import mongoose from "mongoose"

const order_schema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  phone_number: { type: String, required: true },
  quantity: { type: Number, default: 2 },
  osis_code: { type: String, required: true },
})

export const Order = mongoose.model('Order', order_schema, "orders")