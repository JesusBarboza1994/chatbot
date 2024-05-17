let messageStore = {}

export const waitForMessage = (req, res, next) => {
  const userId = req.body.WaId;
  const message = req.body.Body;

  
  if (!messageStore[userId]) {
    // No hay mensajes previos, inicializa la estructura
    messageStore[userId] = {
        messages: [],
        timer: null
    };
  }

  // Agregar mensaje al buffer
  messageStore[userId].messages.push(message);

  // Reiniciar el temporizador
  if (messageStore[userId].timer) {
      clearTimeout(messageStore[userId].timer);
  }
  messageStore[userId].timer = setTimeout(() => {
      req.messageStore = messageStore
      next()
  }, 8000); // Temporizador de 10 segundos
  console.log(`Mensaje recibido: ${message}`)
  console.log(messageStore)
  res.send(`Mensaje recibido: ${message}`);
}