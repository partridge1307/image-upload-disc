const { Partials, Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    32767,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.once("ready", (client) => {
  console.log(`${client.user.tag} is live`);
});

module.exports = client;
