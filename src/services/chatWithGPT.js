import { sendMessageOpenAi } from "../connections/openai/sendMessage.js";
import { FunctionDao, UserDao } from "../dao/index.js";
// import { chat_functions } from "../utils/tools.js";
import { askApi } from "./askApi.js";
import { createOrder } from "./createOrder.js";

export async function chatWithGPT({ chat, store }) {
  const messages = chat.messages.map((mess) => {
    return { role: mess.role, content: mess.content };
  });
  const user = await UserDao.findUserByStore({ store });
  const first_prompt = {
    role: "system",
    content: user.prompt,
  };

  const chat_functions = await FunctionDao.findFunctionByStore({ store });
  const response = await sendMessageOpenAi({
    messages,
    first_prompt,
    chat_functions,
  });
  if (response.data.choices[0].message.tool_calls) {
    const function_data =
      response.data.choices[0].message.tool_calls[0].function;
    console.log("Respuesta de FUNCION:", function_data);
    if (function_data.name === "create_order")
      return await createOrder({
        values: JSON.parse(function_data.arguments),
        chat,
      });
    if (function_data.name === "ask_api")
      return await askApi({ function_data, chat, store });
  } else {
    console.log("Respuesta de OpenAI:", response.data.choices[0].message);
    const response_chat = response.data.choices[0].message.content;
    console.log("RES", response_chat);
    chat.messages.push({
      role: "assistant",
      content: response_chat,
    });
    chat.save();
    return response_chat;
  }
}
