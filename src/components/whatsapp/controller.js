function testWebhook(req, res) {
  res.send("OK");
}

function receiveMessages(req, res) {

  res.send("OK");
}


module.exports = {
  testWebhook,
  receiveMessages
}