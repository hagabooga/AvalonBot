import * as log from 'loglevel';
import {
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
    message.channel.send('test');
  }
}

export default GameSetup;
