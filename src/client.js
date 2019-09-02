import Discord from 'discord.js';
import dotenv from 'dotenv';
import * as log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';
import Channel from './channel';
import {
  COMMAND_CHANNEL_DEINIT,
  COMMAND_CHANNEL_INIT,
  COMMAND_PREFIX,
} from './constants';
import moderator from './moderator';
import {logFormat, logFormatCritical, logReprChannel} from './util';

// Load in env vars from .env file and grab Discord API token
dotenv.config();
const discordApiToken = process.env.DISCORD_API_TOKEN;
const logLevel = process.env.LOGLEVEL;
const forceJoinEnabled =
  process.env.ENABLE_FORCE_JOIN === 'TRUE' ? true : false;

// Setup logging
prefix.reg(log);
prefix.apply(log, logFormat);
prefix.apply(log.getLogger('critical'), logFormatCritical);
log.setLevel(logLevel);

// Initialize hash table with unique channel IDs (as strings) as keys
// and Channel instances as values
let channels = {};

// Bot setup
const client = new Discord.Client();

// Store game IDs in use so we don't have duplicates
let usedGameIds = [];

// Message handling
client.on('message', message => {
  if (message.channel.id in channels) {
    if (message.content === COMMAND_PREFIX + COMMAND_CHANNEL_DEINIT) {
      // Remove the channel
      delete channels[message.channel.id];

      log.debug(`removing ${logReprChannel(message.channel)}`);

      moderator.channelDeinit(message);
    } else {
      // Send message to channel message handler
      channels[message.channel.id].handleMessage(message);
    }
  } else if (message.content === COMMAND_PREFIX + COMMAND_CHANNEL_INIT) {
    // Initialize the channel
    channels[message.channel.id] = new Channel(
      client,
      forceJoinEnabled,
      usedGameIds
    );

    log.debug(`initializing ${logReprChannel(message.channel)}`);

    moderator.channelInit(message);
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
