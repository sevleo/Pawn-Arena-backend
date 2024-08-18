class Client {
  constructor(ws) {
    this.ws = ws;
    this.clientId = ws.clientId;
  }
}

module.exports = Client;
