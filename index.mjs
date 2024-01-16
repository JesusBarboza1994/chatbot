import { OpenAI } from 'openai';
console.log("APIKEY",process.env.SECRET_KEY)
// const configuration = new Configuration({
//   apiKey: process.env.SECRET_KEY
// })

// const openai = new OpenAIApi(configuration);

const openai = new OpenAI({
  apiKey: process.env.SECRET_KEY // This is the default and can be omitted
});

async function enviarConsulta() {
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Este es una prueba.' }],
        model: 'gpt-3.5-turbo',
      });
      console.log(chatCompletion.choices[0].message)
        // return response.choices[0].text;
    } catch (error) {
        console.error("Error al hacer la solicitud: ", error);
    }
}

await enviarConsulta()
