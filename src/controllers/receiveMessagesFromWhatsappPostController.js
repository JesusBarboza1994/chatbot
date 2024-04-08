import { receiveMessagesFromWhatsapp } from "../services/receiveMessagesFromWhatsapp.js";
import { twilioService } from "../services/twilio.js";

export async function receiveMessagesFromWhatsappPostController(req, res) {
  const body = req.body;
  const { store } = req.params
  console.log("🚀 ~ receiveMessagesFromWhatsappPostController ~ body:", body);

  try {
    const response = await twilioService({body, store})
    if (response?.code) return res.status(response.code).send(response.message);      
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
    });
  }


  // if (body.entry[0].changes[0].value.messages) {
  //   // TODO: Validar si se puede recibir un excel por aqui y crear productos
  //   console.log("WSP TEXT", body.entry[0].changes[0].value.messages[0].text);
  //   try {
  //     const response = await receiveMessagesFromWhatsapp({ body, store });
  //     if (response?.code) {
  //       return res.status(response.code).send(response.message);
  //     }
  //     return res.status(200).send(response);
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).send({
  //       message: error.message,
  //     });
  //   }
  // }
}
