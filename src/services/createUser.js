import { UserDao } from "../dao/index.js"

export default async function createUser({store, phone_number, email, password, prompt}) {
  const user = await UserDao.createOrUpdateUser({
    store,
    phone_number,
    email,
    password,
    prompt
  })
  return user
}