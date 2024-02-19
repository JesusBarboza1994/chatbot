import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.SECRET_KEY // This is the default and can be omitted
});

// Creación de un asistente para envio de mensajes en hilos.
// VENTAJAS: Al crear un hilo, no necesita estar enviando todos los mensajes de vez en vez.
// DESVENATAJAS: La respuesta se tiene que solicitar y no hay streaming actual que retorne la respuesta cuando ya esté lista, hay que revisar a cada rato cuando este.
// COSTOS: A simple vista, un asistente tiene más capacidad, subir archivos y entenderlos, el costo por ende parece ser más elevado.
export async function openAIBeta(req, res){
  // const assistant = await openai.beta.assistants.create({
  //   name: "Math Tutor",
  //   instructions: "You are a personal math tutor. Write and run code to answer math questions.",
  //   tools: [{ type: "code_interpreter" }],
  //   model: "gpt-3.5-turbo-1106"
  // });
  const assistant = {
    id:"asst_oC6NTjaVRqSxpx3gXIwUk8xw"
  }
  console.log("ASSISTANT",assistant)

  // const thread = await openai.beta.threads.create();
  const thread = {
    id: "thread_9dfNquChD5mVjWKkxhF95EVV"
  }
  // console.log("THREAD",thread)
  // const message = await openai.beta.threads.messages.create(
  //   thread.id,
  //   {
  //     role: "user",
  //     content: "Explicame el paso a paso de esa ecuación"
  //   }
  // );
  // console.log("MESSAGE",message)
  
  // const run = await openai.beta.threads.runs.create(
  //   thread.id,
  //   { assistant_id: assistant.id }
  // );
  const run = {
    id: 'run_WuLkZxM9C4QgyBzNsYEB62iY'
  }
  // console.log("RUN", run)
  // const run_status = await openai.beta.threads.runs.retrieve(
  //   thread.id,
  //   run.id
  // );
  const run_status = await openai.beta.threads.runs.retrieve(
    thread.id,
    run.id
  );
  console.log("RUN_STATUS", run_status)
  const threadMessages = await openai.beta.threads.messages.list(
    thread.id
  );
  console.log("THREAD_MESSAGES",threadMessages.body.data)


  const runStep = await openai.beta.threads.runs.steps.list(
    "thread_9dfNquChD5mVjWKkxhF95EVV",
    "run_WuLkZxM9C4QgyBzNsYEB62iY"
  );
  return res.json({
    run_status, threadMessages, runStep
  })
}

import path from 'path'
import fs from 'fs'
import { askOpenAI } from "./utils/functionOpenAi.js";
import { Chat } from "../../models/chat.js";

// Genera un audio a partir de un texto
export async function textToSpeech(req, res){
  const speechFile = path.resolve("./speech2.mp3");
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: "Recuerda, que con los resortes Transmeta te llevas de regalo un sticker!",
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}

export async function useFunctionOpenAi(req, res){
  const {phone_number, text} = req.body
  let chat = await Chat.findOne({ phone_number })
  if(!chat){
    chat = await Chat.create({
      phone_number,
      messages: [{
        created_at: new Date(),
        role: 'user',
        content: text
      }]
    })
  }else{
    chat.messages.push({
      role: 'user',
      content: text
    })
    await chat.save()
  }
  const data = await askOpenAI(chat)
  return res.status(200).json(
    {
      success: true,
      data
    }
  )
}