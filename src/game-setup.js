import * as log from 'loglevel';
import {
  COMMAND_STATUS,
  COMMAND_GAME_SETUP_STOP,
  STATE_GAME_SETUP_SETTING_UP,
  STATE_GAME_SETUP_STOPPED,
  STATE_GAME_SETUP_READY,
} from './constants';
import moderator from './moderator';
import {logReprChannel} from './util';

class GameSetup {
  constructor(client, adminId, playerIds) {
    // The bot client
    this.client = client;

    // The game setup state
    this.state = STATE_GAME_SETUP_SETTING_UP;

    // The lobby admin
    this.admin = adminId;

    // Array of player's unique IDs (as strings)
    this.players = playerIds;
  }

  handleCommand(message, command) {
    if (command[0] === COMMAND_STATUS) {
      // Inform the player about the status of the lobby
      moderator.gameSetupStatus(message, this);
    } else if (this.playerIsJoined(message.author)) {
      // Send to method handling commands for active players
      this.handleJoinedPlayerCommand(message, command);
    }
  }

  handleJoinedPlayerCommand(message, command) {
    if (command[0] === COMMAND_GAME_SETUP_STOP) {
      // Set the game setup state to stopped
      this.setState(message.channel, STATE_GAME_SETUP_STOPPED);

      moderator.gameSetupStop(message);
    }
  }

  playerIsJoined(user) {
    return this.players.includes(user.id);
  }

  setState(channel, state) {
    log.debug(
      `setting game setup state to '${state}' in ${logReprChannel(channel)}`
    );

    this.state = state;
  }
}

export default GameSetup;
