import { Order } from "../models/order.js"

export async function createOrder({values, chat}){
  await Order.create({
    osis_code: values.osis_code,
    quantity: values.quantity,
    phone_number: chat.phone_number
  })
  const create_order_message = `Su pedido ha sido creado exitosamente. Muchas gracias.`
  chat.messages.push({
    role: 'assistant',
    content: create_order_message
  })
  chat.save()
  return create_order_message
}