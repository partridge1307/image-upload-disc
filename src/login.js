const { BOT_TOKEN } = require("../config.json");
const { Client, GatewayIntentBits } = require("discord.js");

if (!BOT_TOKEN.length) return console.log("Please add at least one Bot token");

let clients = [];
for (const [i, token] of BOT_TOKEN.entries()) {
  (clients[i] = new Client({
    intents: GatewayIntentBits.MessageContent,
  })),
    clients[i].once("ready", (client) => {
      console.log(`${client.user.tag} is ready to use`);
    });

  clients[i].login(token);
}

module.exports = clients;
