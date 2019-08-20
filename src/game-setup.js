import * as log from 'loglevel';
import {
  COMMAND_STATUS,
  STATE_GAME_SETUP_SETTING_UP,
  STATE_GAME_SETUP_STOPPED,
  STATE_GAME_SETUP_READY,
} from './constants';
import moderator from './moderator';

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
    }
  }
}

export default GameSetup;
