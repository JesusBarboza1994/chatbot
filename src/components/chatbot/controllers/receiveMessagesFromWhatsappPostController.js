import { receiveMessagesFromWhatsapp } from "../services/receiveMessagesFromWhatsapp.js"

export async function receiveMessagesFromWhatsappPostController(req, res) {
  const body = req.body
  console.log("🚀 ~ receiveMessagesFromWhatsappPostController ~ body:", body)

  if(req.body.entry[0].changes[0].value.messages){
    console.log("WSP TEXT", body.entry[0].changes[0].value.messages[0].text)
    try {
      const response = await receiveMessagesFromWhatsapp({body})
      if(response.code){
        return res.status(response.code).send(response.message)
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        message: error.message
      })
    }
  }
}
