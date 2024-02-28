import axios from "axios";

export async function sendMessageOpenAi({messages, model= "gpt-3.5-turbo", chat_functions, first_prompt}) {
  const OPENAI_API_KEY = process.env.SECRET_KEY;
  const data = {
    model,
    messages: [
      first_prompt,
      ...messages
    ],
    tools: chat_functions
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  };

  const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers })
  
  return response
}