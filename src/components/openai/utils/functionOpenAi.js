
import axios from "axios";
import { queryDataBase } from "../../whatsapp/utils/queryDatabase.js";
import {Order} from "../../../models/order.js";
const tools = [
  {
      "type": "function",
      "function": {
          "name": "ask_api",
          "description": "Use this function to answer user questions about a helicoidal spring database. Deberás preguntar por todos los valores que necesitas y mostrar como resultado un JSON.",
          "parameters": {
              "type": "object",
              "properties": {
                  "brand": {
                      "type": "string",
                      "description": "Este valor es la marca de autos asociada al producto. Debe ser consultado. Siempre irá en mayúsculas y deberás corregirlo en caso el usuario lo escriba mal.",
                  },
                  "model": {
                    "type": "string",
                    "description": "Este valor es el modelo del auto asociado a la marca. Debe ser consultado. Siempre irá en mayúsculas y deberás corregirlo en caso el usuario lo escriba mal.",
                  },
                  "year": {
                    "type": "string",
                    "description": "Es el año de fabricación del vehículo. Debe ser consultado."
                  },
                  "position": {
                    "type": "string",
                    "description": "Es la posición del resorte requerido para el vehículo. Solo puede tener dos valores: 'POST' que se escribe si es posterior o 'DEL' que se escribe si es delantero. Debe ser consultado."
                  },
                  "version":{
                    "type": "string",
                    "description": "Es la versión del producto requerido. Debe ser consultado y sus valores solo podrán ser:  Original, y Reforzado si la posición es DEL; o Original, GLP, GNV3, GNV4, GNV5 si es POST. Le puedes dar las opciones si el usuario lo solicita."
                  }

              },
              "required": ["brand", "model", "year"]
          },
      }
  },
  {
      "type": "function",
      "function": {
          "name": "create_order",
          "description": "Si el cliente acepta el producto se procede con la creación de un pedido para el cliente.",
          "parameters": {
              "type": "object",
              "properties": {
                  "quantity": {
                      "type": "string",
                      "description": "Por defecto es 2. Se debe preguntar al cliente la cantidad de resortes que desea comprar.",
                  },
                  "osis_code": {
                    "type": "string",
                    "description": "Extraer de la respuesta anterior al cliente el osis_code que se muestra.",
                  }
                },
                "required": ["quantity", "osis_code"]
            },
        }
  }
]
const OPENAI_API_KEY = process.env.SECRET_KEY;
export async function askOpenAI(chat={messages:[]}){
  const messages = chat.messages.map(mess => {return {role: mess.role, content: mess.content}})
  // console.log("MESSAGES",messages)
  
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Eres un asistente virtual de atención al cliente mediante whatsapp. Tu nombre es Jesús. Tu objetivo principal es responder a los usuarios sobre los productos que se ofrecen. Los productos que se venden son resortes de suspensión automotriz.'
      },
      ...messages
    ],
    tools: tools
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  };

  const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers })
  let response_chat
  if(response.data.choices[0].message.tool_calls){
    console.log('Respuesta de FUNCION:', response.data.choices[0].message.tool_calls);
    if(response.data.choices[0].message.tool_calls[0].function.name === 'create_order'){
        const order_data = JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments)
        await Order.create({
          osis_code: order_data.osis_code,
          quantity: order_data.quantity,
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
    if(response.data.choices[0].message.tool_calls[0].function.name === 'ask_api'){
      try {
        const response_query = await queryDataBase(response.data.choices[0].message.tool_calls[0].function.arguments)
        chat.messages.push({
          role: 'system',
          content: `Desglosa la información puesta dentro de este array para responder: ${response_query}`
        })
        console.log("DATA",  `Desglosa la información puesta dentro de este array para responder: ${response_query}`)
        chat.save()
        return await askOpenAI(chat)  
       
      } catch (error) {
        console.log("ERROR", error)
        const no_stock_response = `Por el momento no contamos con estos resortes en nuestro stock.`
        chat.messages.push({
          role: 'assistant',
          content: no_stock_response
        })
        chat.save()
        return no_stock_response
      }
    }
    
  }else{
    console.log('Respuesta de OpenAI:', response.data.choices[0].message);
    response_chat = response.data.choices[0].message.content
    console.log("RES", response_chat)
    chat.messages.push({
      role: 'assistant',
      content: response_chat
    })
    chat.save()
    return response_chat
  }
}
