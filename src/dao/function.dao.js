import { Function } from "../models/function.js";

async function createFunction({ name, description, properties, required, store }) {
  return await Function.findOneAndUpdate(
    { name, store },
    { name, description, properties, required },
    { upsert: true, new: true }
  )
}

async function findFunctionByStore({ store }) {
  const functions = await Function.find({ store });
  return functions.map(function_value =>{
    return({
      "type": "function",
      "function": {
        "name": function_value.name,
        "description": function_value.description,
        "parameters": {
          "type": "object",
          "properties": function_value.properties,
          "required": function_value.required
        }
      }
    })
  })
}

export default {
  createFunction,
  findFunctionByStore
}
