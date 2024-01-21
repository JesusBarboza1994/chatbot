import axios from "axios";
import { Chat } from "../model.js";

const OPENAI_API_KEY = process.env.SECRET_KEY;
export async function askOpenAI(text, customer){
  const raw_messages = await Chat.find({ customer: customer._id }).sort({ created_at: 1 })
  const messages = raw_messages.map((message) => {
    return {
      role: message.role,
      content: message.message
    }
  })
  console.log("MESSAGESSSSSSS",messages)
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Eres un desarrollador de codigo web. Te van a enviar una solicitud indicando que un cliente pide un producto. Tu harás como si estuvieras consultando una base de datos nosql que solo es una coleccion de productos, para este caso son resortes, que tienen las keys: "codigo", "descripción", "diametro de alambre", precio de venta". Vas a retornar el query a una base de datos nosql como si se consultara a esa tabla en SQL. Tu misión será retornar el query para devolver el precio. Además, eres capaz de responder preguntas concernientes a una conversación como rescatar el nombre del cliente, direcciones u otros datos interesantes utiles para la conversación.'
      },
      {
        role: 'system',
        content: 'Si el cliente solicita información sobre productos, devuelves la query para la consulta. En caso de hacerlo, debes enviar la KEY=123456 como un array en formato de string, donde el primer valor es la respuesta del query, y segundo la key, para poder capturarla desde el codigo donde estás siendo ejecutada. En caso escriba información sobre otro tema, deberás responder normalmente y no retornar ninguna key.'
      },
      {
        role: 'user',
        content: text
      },
      ...messages
    ]
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  };

  const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers })
  console.log('Respuesta de OpenAI:', response.data.choices[0].message);
  const response_chat = response.data.choices[0].message.content
  await Chat.create({
    customer: customer._id,
    role: 'system',
    message: response_chat,
  })
  return response_chat
}
