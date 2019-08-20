import * as log from 'loglevel';
import {
  COMMAND_ABOUT,
  COMMAND_GAME_LOBBY_CREATE,
  COMMAND_HELP,
  COMMAND_PREFIX,
  COMMAND_RULES,
  COMMAND_STATUS,
  COMMAND_WEBSITE,
  STATE_CHANNEL_GAME,
  STATE_CHANNEL_LOBBY,
  STATE_CHANNEL_SETUP,
  STATE_GAME_LOBBY_READY,
  STATE_GAME_LOBBY_STOPPED,
  STATE_GAME_SETUP_READY,
  STATE_GAME_SETUP_STOPPED,
} from './constants';
import GameLobby from './game-lobby';
import GameSetup from './game-setup';
import moderator from './moderator';
import {logReprChannel} from './util';

class Channel {
  constructor(client, forceJoinEnabled) {
    // The bot client
    this.client = client;

    // Channel state
    this.state = null;

    // Setting for whether the force join command is enabled for game
    // lobbies
    this.forceJoinEnabled = forceJoinEnabled;

    // Current game lobby, game setup, or game
    this.gameLobby = null;
    this.gameSetup = null;
    this.game = null;
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
    if (command[0] === COMMAND_HELP) {
      moderator.help(message);
    } else if (command[0] === COMMAND_RULES) {
      moderator.rules(message);
    } else if (command[0] === COMMAND_ABOUT) {
      moderator.about(message);
    } else if (command[0] === COMMAND_WEBSITE) {
      moderator.website(message);
    } else if (this.state === STATE_CHANNEL_LOBBY) {
      // Send to game lobby message handler
      this.gameLobby.handleCommand(message, command);

      // Check lobby state and take appropriate actions
      if (this.gameLobby.state === STATE_GAME_LOBBY_STOPPED) {
        this.removeLobby(message);
      } else if (this.gameLobby.state === STATE_GAME_LOBBY_READY) {
        let adminId = this.gameLobby.admin;
        let playerIds = this.gameLobby.players;

        this.removeLobby(message);
        this.createGameSetup(message, adminId, playerIds);
      }
    } else if (this.state === STATE_CHANNEL_SETUP) {
      // Send to game setup message handler
      this.gameSetup.handleCommand(message, command);

      // Check game setup state and take appropriate actions
      if (this.gameSetup.state === STATE_GAME_SETUP_STOPPED) {
        this.removeGameSetup(message);
      }
    } else if (this.state === STATE_CHANNEL_GAME) {
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

    this.state = STATE_CHANNEL_LOBBY;
    this.gameLobby = new GameLobby(message, this.client, this.forceJoinEnabled);
  }

  removeLobby(message) {
    log.debug(`removing game lobby in ${logReprChannel(message.channel)}`);

    this.state = null;
    this.gameLobby = null;
  }

  createGameSetup(message, adminId, playerIds) {
    log.debug(`creating game setup in ${logReprChannel(message.channel)}`);

    this.state = STATE_CHANNEL_SETUP;
    this.gameSetup = new GameSetup(message, this.client, adminId, playerIds);
  }

  removeGameSetup(message) {
    log.debug(`removing game setup in ${logReprChannel(message.channel)}`);

    this.state = null;
    this.gameSetup = null;
  }
}

export default Channel;
