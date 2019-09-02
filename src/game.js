import * as log from 'loglevel';
import {
  COMMAND_STATUS,
  GAME_RULESET_AVALON,
  GAME_RULESET_AVALON_WITH_TARGETING,
} from './constants';
import moderator from './moderator';
import {logReprChannel, logReprUser, fisherYatesShuffle} from './util';

class Game {
  constructor(message, client, playerIds, roleKeys, ruleset) {
    // The bot client
    this.client = client;

    // The Discord channel for this lobby
    this.channel = message.channel;

    // (Randomized) array of player's unique IDs (as strings)
    this.players = fisherYatesShuffle(playerIds);

    // The leader's player ID
    this.leaderIdx = 0;
    this.leader = this.players[leaderIdx];

    // Ruleset
    this.ruleset = ruleset;

    // TODO assign roles
    this.rolesTable = {};
  }

  handleCommand(message, command) {
    if (command[0] === COMMAND_STATUS) {
      // Inform the player about the status of the lobby
      moderator.gameStatus(message, this);
    }
  }
}

export default Game;
