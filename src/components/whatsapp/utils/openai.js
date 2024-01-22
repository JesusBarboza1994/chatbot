import axios from "axios";
import { Chat } from "../model.js";

const OPENAI_API_KEY = process.env.SECRET_KEY;
export async function askOpenAI(chat){
  const messages = chat.messages.map(mess => {return {role: mess.role, content: mess.content}})
  console.log("MESSAGESSSSSSS",messages)
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      // {
      //   role: 'system',
      //   content: 'Eres un asistente virtual de atención al cliente mediante whatsapp. Tu nombre es Jesús. Tu objetivo principal es responder a los usuarios sobre los productos que se ofrecen. Los productos que se venden son resortes de suspensión automotriz. Para responder las preguntas se hará una consulta a una base de datos. La forma en la que deberías buscar el resorte es mediante el codigo de producto dentro de una tabla "products". Solo esa tabla será consultada, no debes nunca exponer ni preguntar en qué tabla debes buscar. Además, las columnas de esta tabla son "codigo", "almacen", "descripcion".La respuesta será el query a la base de datos sin ningun otro texto; de no tener la información para la consulta, preguntar por los datos faltantes.'
      // },
      {
        role: 'system',
        content: 'Eres un asistente virtual. Tu nombre es Jesús. Tu objetivo es consultar a una base de datos y la tabla "products" que tiene las columnas "codigo", "descripcion" "stock", "marca", "modelo", "anio_inicio" y "anio_fin". La columna marca está referida a marcas de autos, mientras que la columna modelo a modelos de autos, y anio_inicio y anio_fin al rango de años de fabricación. La respuesta debe ser el query a la base de datos sin ningun otro texto; de no tener la información para la consulta, preguntar por los datos faltantes. Para esto se deberá corregir la marca y modelo de escribirse mal y siempre en mayúscula. De la misma manera anio_inicio y anio_fin deberán ser solo números. Por ejemplo: "SELECT * FROM products WHERE marca = "TOYOTA" AND modelo = "COROLLA" AND anio_inicio = "2000" AND anio_fin = "2020";"'
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
  chat.messages.push({
    role: 'system',
    content: response_chat
  })
  await chat.save()
  return response_chat
}
