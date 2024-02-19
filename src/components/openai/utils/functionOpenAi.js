
import axios from "axios";
import { queryDataBase } from "../../whatsapp/utils/queryDatabase.js";

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
                    "description": "Es la versión del producto requerido. Debe ser consultado y sus valores solo podrán ser:  Original, GLP, GNV3, GNV4, GNV5,  Reforzado, Progresivo. Le puedes dar las opciones si el usuario lo solicita."
                  }

              },
              "required": ["brand", "model", "year", "position","version"]
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
export async function askOpenAI(chat={messages:[]}, data_api=null){
  const messages = chat.messages.map(mess => {return {role: mess.role, content: mess.content}})
  console.log("MESSAGESSSSSSS",messages)
  
  const data = {
    model: 'gpt-4-1106-preview',
    messages: [
      {
        role: 'system',
        content: 'Eres un asistente virtual de atención al cliente mediante whatsapp. Tu nombre es Jesús. Tu objetivo principal es responder a los usuarios sobre los productos que se ofrecen. Los productos que se venden son resortes de suspensión automotriz.'
      },
      // {
      //   role: 'system',
      //   content: 'Tu nombre es Jesús. Tu objetivo es ayudar a las personas con sus sumas.'
      // },
      ...messages
    ],
    tools: tools
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  };

  const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers })
  if(response.data.choices[0].message.tool_calls){
    console.log('Respuesta de FUNCION:', response.data.choices[0].message.tool_calls);
    const response_query = await queryDataBase(response.data.choices[0].message.tool_calls[0].function.arguments)
    chat.messages.push({
      role: 'system',
      content: `Usa esta información para responder al cliente: ${response_query}`
    })
    chat.save()
    return await askOpenAI(chat)
  }else{
    console.log('Respuesta de OpenAI:', response.data.choices[0].message);
    const response_chat = response.data.choices[0].message.content
    console.log("RES", response_chat)
    chat.messages.push({
      role: 'system',
      content: response_chat
    })
    chat.save()
    return response_chat
  }
}
