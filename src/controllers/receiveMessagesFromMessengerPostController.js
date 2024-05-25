import { receiveMessagesFromMessenger } from "../services/receiveMessagesFromMessenger.service.js"

export default async function receiveMessagesFromMessengerPostController(req, res) {
  try {
    const body = req.body
    const { store } = req.params
    console.log("BODY", body)
    await receiveMessagesFromMessenger({...body, store})
  } catch (error) {
    console.log("🚀 ~ receiveMessagesFromMessengerPostController ~ error:", error)
    if(error.status == 400) return res.status(400).send({ success: false, errors: error.message, code: error.code })
      return res.status(500).send({ success: false, errors: error.message })
  }
}