import Discord from 'discord.js';
import dotenv from 'dotenv';
import * as log from 'loglevel';
import Channel from './channel';
import {BOT_WEBSITE, COMMAND_CHANNEL_INIT, COMMAND_PREFIX} from './constants';

// Load in env vars from .env file and grab Discord API token
dotenv.config();
const discordApiToken = process.env.DISCORD_API_TOKEN;
const logLevel = process.env.LOGLEVEL;

// Setup logging
// TODO setup timestamps and loglevel visibility
log.setLevel(logLevel);

// Initialize hash table with unique channel IDs (as strings) as keys
// and Channel instances as values
let channels = {};

// Bot setup
const client = new Discord.Client();

// Message handling
client.on('message', message => {
  if (message.channel.id in channels) {
    // Send message to channel message handler
    channels[message.channel.id].handleMessage(message);
  } else if (message.content === COMMAND_PREFIX + COMMAND_CHANNEL_INIT) {
    // Initialize the channel
    channels[message.channel.id] = new Channel();
    log.debug(
      `adding new channel ID:${message.channel.id} NAME:${message.channel.name}`
    );
  }
});

// Start the bot client
client
  .login(discordApiToken)
  .then(() =>
    log.info(
      `successfully logged in as ${client.user.username}#${client.user.discriminator}`
    )
  );
