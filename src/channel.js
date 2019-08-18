import * as log from 'loglevel';
import {
  COMMAND_CHANNEL_STATUS,
  COMMAND_GAME_LOBBY_CREATE,
  COMMAND_HELP,
  COMMAND_PREFIX,
  COMMAND_WEBSITE,
  STATE_CHANNEL_GAME,
  STATE_CHANNEL_LOBBY,
} from './constants';
import GameLobby from './game-lobby';
import moderator from './moderator';
import {logReprChannel} from './util';

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
      moderator.website(message);
    } else if (command[0] === COMMAND_HELP) {
      moderator.help(message);
    } else if (this.channelState === STATE_CHANNEL_LOBBY) {
      // Send to game lobby message handler
      this.gameLobby.handleCommand(message, command);
    } else if (this.channelState === STATE_CHANNEL_GAME) {
      // TODO send message to game message handler
    } else if (command[0] === COMMAND_GAME_LOBBY_CREATE) {
      // Create a game lobby
      this.createLobby(message);

      moderator.lobbyCreate(message);
    } else if (command[0] === COMMAND_CHANNEL_STATUS) {
      // Note that this channel status command only works when *neither*
      // a game lobby nor game are active
      moderator.channelStatus(message);
    }
  }

  createLobby(message) {
    this.channelState = STATE_CHANNEL_LOBBY;
    this.gameLobby = new GameLobby(message);

    log.debug(`creating game lobby in ${logReprChannel(message.channel)}`);
  }
}

export default Channel;
