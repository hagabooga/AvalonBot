import * as log from 'loglevel';
import {
  BOT_WEBSITE,
  COMMAND_GAME_CREATE,
  COMMAND_HELP,
  COMMAND_PREFIX,
  COMMAND_WEBSITE,
  STATE_CHANNEL_GAME,
  STATE_CHANNEL_LOBBY,
} from './constants';
import GameLobby from './game-lobby';

class Channel {
  constructor(channelId) {
    // Channel state
    this.channelState = null;

    // Current game xor lobby
    this.game = null;
    this.gameLobby = null;
  }

  handleMessage(message) {
    // Reactions - these are just for fun
    if (message.content === 'leg') {
      message.react('🍗');
    } else if (message.content === 'trash') {
      message.react('🗑');
    } else if (message.content === 'cloud pussy') {
      message.react('☁').then(() => message.react('🐈'));
    }

    // Parse the command if it's a command; else ignore
    if (message.content.startsWith(COMMAND_PREFIX)) {
      this.handleCommand(
        message,
        message.content.substring(COMMAND_PREFIX.length).split(' ')
      );
    }
  }

  handleCommand(message, command) {
    if (command[0] === COMMAND_WEBSITE) {
      message.channel.send(BOT_WEBSITE);
    } else if (command[0] === COMMAND_HELP) {
      // TODO add actual help text
      message.channel.send('i c it');
    } else if (this.channelState === STATE_CHANNEL_LOBBY) {
      // TODO send message to lobby message handler
    } else if (this.channelState === STATE_CHANNEL_GAME) {
      // TODO send message to game message handler
    } else if (command[0] === COMMAND_GAME_CREATE) {
      // Create a game lobby
      this.channelState = STATE_CHANNEL_LOBBY;
      this.gameLobby = new GameLobby();

      log.debug(
        `created game lobby for channel ${message.channel.id} (${message.channel.name})`
      );

      // TODO add actual lobby creation message
      message.channel.send(`new lobby created in ${message.channel.name}`);
    }
  }
}

export default Channel;
