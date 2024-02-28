import { User } from "../models/user.js"

async function createOrUpdateUser({store, phone_number, email, password, prompt}){
  try {
    const user = await User.findOneAndUpdate(
      {email},
      {phone_number, store, password, prompt, updated_at: new Date()},
      {upsert: true, new: true}
    )
    return user
  } catch (error) {
    console.log("🚀 ~ createOrUpdateUser ~ error:", error)
    throw error
  }
}

async function findUserByStore({store}){
  return await User.findOne({store})
}

export default {
  createOrUpdateUser,
  findUserByStore
}