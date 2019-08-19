import * as log from 'loglevel';
import {
  COMMAND_ABOUT,
  COMMAND_GAME_LOBBY_CREATE,
  COMMAND_HELP,
  COMMAND_PREFIX,
  COMMAND_STATUS,
  COMMAND_WEBSITE,
  STATE_CHANNEL_GAME,
  STATE_CHANNEL_LOBBY,
  STATE_GAME_LOBBY_STOPPED,
} from './constants';
import GameLobby from './game-lobby';
import moderator from './moderator';
import {logReprChannel} from './util';

class Channel {
  constructor(client, forceJoinEnabled) {
    // The bot client
    this.client = client;

    // Channel state
    this.channelState = null;

    // Setting for whether the force join command is enabled for game
    // lobbies
    this.forceJoinEnabled = forceJoinEnabled;

    // Current game xor lobby
    this.game = null;
    this.gameLobby = null;
  }

  handleMessage(message) {
    // Reactions - these are just for fun
    if (message.content === 'leg') {
      message.react('🍗');
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
    } else if (command[0] === COMMAND_ABOUT) {
      moderator.about(message);
    } else if (this.channelState === STATE_CHANNEL_LOBBY) {
      // Send to game lobby message handler
      this.gameLobby.handleCommand(message, command);

      // Check lobby state and take appropriate actions
      if (this.gameLobby.gameLobbyState === STATE_GAME_LOBBY_STOPPED) {
        this.removeLobby(message);
      }
    } else if (this.channelState === STATE_CHANNEL_GAME) {
      // TODO send message to game message handler
    } else if (command[0] === COMMAND_GAME_LOBBY_CREATE) {
      moderator.lobbyCreate(message);

      // Create a game lobby
      this.createLobby(message);
    } else if (command[0] === COMMAND_STATUS) {
      // Note that this channel status command only works when *neither*
      // a game lobby nor game are active
      moderator.channelStatus(message);
    }
  }

  createLobby(message) {
    log.debug(`creating game lobby in ${logReprChannel(message.channel)}`);

    this.channelState = STATE_CHANNEL_LOBBY;
    this.gameLobby = new GameLobby(message, this.client, this.forceJoinEnabled);
  }

  removeLobby(message) {
    log.debug(`removing game lobby in ${logReprChannel(message.channel)}`);

    this.channelState = null;
    this.gameLobby = null;
  }
}

export default Channel;
