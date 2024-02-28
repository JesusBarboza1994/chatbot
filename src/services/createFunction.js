import { FunctionDao } from "../dao/index.js";

export default async function createFunction({name, description, properties, required, store}) {
  return await FunctionDao.createFunction({name, description, properties, required, store})
}