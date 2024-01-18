import axios from 'axios';

const OPENAI_API_KEY = process.env.SECRET_KEY;

const data = {
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'system',
      content: 'Eres un desarrollador de codigo web. Te van a enviar una solicitud indicando que un cliente pide un producto. Tu harás como si estuvieras consultando una base de datos que solo es una tabla de productos, para este caso son resortes, que tienen las columnas: "codigo", "descripción", "diametro de alambre", precio de venta". Vas a retornar el query como si se consultara a esa tabla en SQL. Tu misión será retornar el query para devolver el precio.'
    },
    {
      role: 'user',
      content: 'Quiero saber sobre el resorte de alambre 14.'
    }
  ]
};

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${OPENAI_API_KEY}`
};

axios.post('https://api.openai.com/v1/chat/completions', data, { headers })
  .then(response => {
    console.log('Respuesta de OpenAI:', response.data.choices[0].message);
  })
  .catch(error => {
    console.error('Error al hacer la solicitud:', error);
    console.log()
  });
