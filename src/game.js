import * as log from 'loglevel';
import {
  COMMAND_STATUS,
  GAME_RULESET_AVALON,
  GAME_RULESET_AVALON_WITH_TARGETING,
} from './constants';
import moderator from './moderator';
import {logReprChannel, logReprUser, fisherYatesShuffle} from './util';

class Game {
  constructor(client, playerIds, roleKeys, ruleset) {
    // The bot client
    this.client = client;

    // (Randomized) array of player's unique IDs (as strings)
    this.players = fisherYatesShuffle(playerIds);

    // The leader's player ID
    this.leader = this.players[0];

    // Ruleset
    this.ruleset = ruleset;

    // TODO assign roles
  }

  handleCommand(message, command) {
    if (command[0] === COMMAND_STATUS) {
      // Inform the player about the status of the lobby
      moderator.gameStatus(message, this);
    }
  }
}

export default Game;
