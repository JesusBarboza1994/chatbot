import { sendMessageOpenAi } from "../connections/openai/sendMessage.js";
import { chat_functions } from "../utils/tools.js";
import { askApi } from "./askApi.js";
import { createOrder } from "./createOrder.js";

const OPENAI_API_KEY = process.env.SECRET_KEY;
export async function chatWithGPT({chat={messages:[]}}){
  const messages = chat.messages.map(mess => {return {role: mess.role, content: mess.content}})
  const first_prompt ={
    role: 'system',
    content: 'Eres un asistente virtual de atención al cliente mediante whatsapp. Tu nombre es Jesús. Tu objetivo principal es responder a los usuarios sobre los productos que se ofrecen. Los productos que se venden son resortes de suspensión automotriz.'
  }
  
  const response = await sendMessageOpenAi({messages, first_prompt, chat_functions})
  if(response.data.choices[0].message.tool_calls){
    const function_data = response.data.choices[0].message.tool_calls[0].function
    console.log('Respuesta de FUNCION:', function_data);
    if(function_data.name === 'create_order') return await createOrder(JSON.parse(function_data.arguments))
    if(function_data.name === 'ask_api') return await askApi({function_data, chat})
    
  }else{
    console.log('Respuesta de OpenAI:', response.data.choices[0].message);
    const response_chat = response.data.choices[0].message.content
    console.log("RES", response_chat)
    chat.messages.push({
      role: 'assistant',
      content: response_chat
    })
    chat.save()
    return response_chat
  }
}
