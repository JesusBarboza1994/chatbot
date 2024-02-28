import { chatWithGPT } from "./chatWithGPT.js"
import { queryDataBase } from "./queryDatabase.js"

export async function askApi({function_data, chat, store}) {
  try {
    const response_query = await queryDataBase(function_data.arguments)
    chat.messages.push({
      role: 'system',
      content: `Desglosa la información puesta dentro de este array para responder de forma amigable: ${response_query}`
    })
    console.log("DATA", response_query)
    chat.save()
    return await chatWithGPT({chat, store})  
   
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