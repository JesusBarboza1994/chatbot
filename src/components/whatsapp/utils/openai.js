import axios from "axios";
import { Chat } from "../model.js";
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

              },
              "required": ["brand", "model", "year", "position"]
          },
      }
  },
  // {
  //   "type": "function",
  //   "function": {
  //       "name": "ask_api",
  //       "description": "Suma dos valores num1 y num2 y devuelve su resultado. Deberás preguntar por todos los valores que necesitas y mostrar como resultado un JSON con el valor de la suma.",
  //       "parameters": {
  //           "type": "object",
  //           "properties": {
  //               "num1": {
  //                   "type": "string",
  //                   "description": "Es el primer valor",
  //               },
  //               "num2": {
  //                 "type": "string",
  //                 "description": "Este valor es el segundo valor",
  //               }
  //           },
  //           "required": ["num1", "num2"]
  //       },
  //   }
  // }
]
const OPENAI_API_KEY = process.env.SECRET_KEY;
export async function askOpenAI(chat, data_api=null){
  const messages = chat.messages.map(mess => {return {role: mess.role, content: mess.content}})
  console.log("MESSAGESSSSSSS",messages)
  // if(data_api){
  //   messages.push({
  //     role: 'system',
  //     content: `Recibirás esta información y se entregaras al cliente pero con una mejor estructura: ${JSON.stringify(data_api)}`
  //   })
  // }
  const data = {
    model: 'gpt-4-1106-preview',
    messages: [
      // {
      //   role: 'system',
      //   content: 'Eres un asistente virtual de atención al cliente mediante whatsapp. Tu nombre es Jesús. Tu objetivo principal es responder a los usuarios sobre los productos que se ofrecen. Los productos que se venden son resortes de suspensión automotriz. Para responder las preguntas se hará una consulta a una base de datos. La forma en la que deberías buscar el resorte es mediante el codigo de producto dentro de una tabla "products". Solo esa tabla será consultada, no debes nunca exponer ni preguntar en qué tabla debes buscar. Además, las columnas de esta tabla son "codigo", "almacen", "descripcion".La respuesta será el query a la base de datos sin ningun otro texto; de no tener la información para la consulta, preguntar por los datos faltantes.'
      // },
      {
        role: 'system',
        content: 'Tu nombre es Jesús. Tu objetivo es generar y responder con un JSON stringify de un objeto a modo de texto que puede tener las keys: "brand", "model", "year", "position" y "version". Cada uno de estos valores debe ser consultado aunque no necesariamente se deberá incluir si es que no se consigue la información. La key "brand" se refiere a la marca de un carro, al igual que la key "model" es el modelo correspondiente a la marca. Deberás corregir la marca y modelo si se escribe mal además de ponerlos en el JSON en mayusculas. Si no consigues información sobre las demás keys, entonces no las ingreses al JSON, pero como mínimo deberá haber una key.'
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
  console.log('Respuesta de OpenAI:', response.data.choices[0].message);
  const response_chat = response.data.choices[0].message.content
  chat.messages.push({
    role: 'system',
    content: response_chat
  })
  await chat.save()
  return response_chat
}
