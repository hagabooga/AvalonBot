import Discord from "discord.js";
import dotenv from "dotenv";
import { BOT_WEBSITE, COMMAND_INIT_BOT, COMMAND_PREFIX } from "./constants";
import Channel from "./Channel";

// Load in env vars from .env file and grab Discord API token
dotenv.config();
const discordApiToken = process.env.DISCORD_API_TOKEN;

// Initialize hash table with unique channel IDs as keys and Channel
// instances as values
let channels = {};

// Bot setup
const client = new Discord.Client();

// Message handling
client.on("message", message => {
  if (message.channel.id in channels) {
    // Send message to channel message handler
    channels[message.channel.id].on_message(message);
  } else if (message.content === COMMAND_PREFIX + COMMAND_INIT_BOT) {
    // Initialize the channel
    channels[message.channel.id] = new Channel();
  }
});

// Start the bot client
client.login(discordApiToken);
