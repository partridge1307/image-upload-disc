const { BOT_TOKEN } = require("../config.json");
const { Client, GatewayIntentBits } = require("discord.js");

if (!BOT_TOKEN.length) return console.log("Please add at least one Bot token");

let bots = [];
for (const [i, token] of BOT_TOKEN.entries()) {
  bots[i] = {
    ready: true,
    client: new Client({
      intents: GatewayIntentBits.MessageContent,
    }),
  };

  bots[i].client.once("ready", (client) => {
    console.log(`${client.user.tag} is ready to use`);
  });

  bots[i].client.login(token);
}

module.exports = bots;
