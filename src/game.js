import * as log from 'loglevel';
import {COMMAND_STATUS} from './constants';
import moderator from './moderator';
import {logReprChannel, logReprUser} from './util';

class Game {
  constructor(message, client, playerIds) {
    // The bot client
    this.client = client;
  }

  handleCommand(message, command) {
    if (command[0] === COMMAND_STATUS) {
      // Inform the player about the status of the lobby
      moderator.gameStatus(message, this);
    }
  }
}

export default Game;
