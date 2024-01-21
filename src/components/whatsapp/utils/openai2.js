import OpenAI from "openai";

export async function openAIBeta(){
  const openai = new OpenAI({
    apiKey: process.env.SECRET_KEY // This is the default and can be omitted
  });
  const assistant = await openai.beta.assistants.create({
    name: "Math Tutor",
    instructions: "You are a personal math tutor. Write and run code to answer math questions.",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-3.5-turbo-1106"
  });
  console.log("ASSISTANT",assistant)

  // const thread = await openai.beta.threads.create();

  console.log("THREAD",thread)
  const message = await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
    }
  );
  const threadMessages = await openai.beta.threads.messages.list(
    "thread_lR7j3Ar9K2m7jrr5s7DB98eL"
  );
}