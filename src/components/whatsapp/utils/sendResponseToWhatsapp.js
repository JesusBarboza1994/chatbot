import axios from "axios";

export async function sendResponseToWhatsapp(body, response_chat, from_number=null){
  const token = process.env.WHATSAPP_TOKEN;
  try {
    // if(body.object){
    //   if (
    //     body.entry &&
    //     body.entry[0].changes &&
    //     body.entry[0].changes[0] &&
    //     body.entry[0].changes[0].value.messages &&
    //     body.entry[0].changes[0].value.messages[0]
    //   ) {
        let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
        console.log("🚀 ~ sendResponseToWhatsapp ~ phone_number_id:", phone_number_id)
        let from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        console.log("🚀 ~ sendResponseToWhatsapp ~ from:", from)
        // let msg_body = body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
        const response = await axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v18.0/" +
            phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from_number || from,
            text: { body: response_chat },
          },
          headers: { "Content-Type": "application/json" },
        });
        if(from_number) console.log("RESPONSE WSP SEND", response.data)
    //   }
    // }
  } catch (error) {
    console.log("ERROR", error)
    throw error
  }
}