import * as log from 'loglevel';
import {
  COMMAND_GAME_SETUP_CHOOSE,
  COMMAND_GAME_SETUP_STOP,
  COMMAND_STATUS,
  GAME_RULESET_AVALON,
  GAME_RULESET_AVALON_OPTION_NUM,
  GAME_RULESET_AVALON_WITH_TARGETING,
  GAME_RULESET_AVALON_WITH_TARGETING_OPTION_NUM,
  STATE_GAME_SETUP_CHOOSING_ROLES,
  STATE_GAME_SETUP_CHOOSING_RULESET,
  STATE_GAME_SETUP_READY,
  STATE_GAME_SETUP_STOPPED,
} from './constants';
import moderator from './moderator';
import {logReprChannel} from './util';

class GameSetup {
  constructor(message, client, adminId, playerIds) {
    // The bot client
    this.client = client;

    // The game setup state
    this.state = STATE_GAME_SETUP_CHOOSING_RULESET;

    // The lobby admin
    this.admin = adminId;

    // Array of player's unique IDs (as strings)
    this.players = playerIds;

    // The game ruleset
    this.ruleset = null;

    // Send welcome message
    moderator.gameSetupIntroduction(message, this.admin);
    moderator.gameSetupChooseRuleset(message, this.admin);
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
    } else if (this.playerIsAdmin(message.author)) {
      // Send to method handling commands for the lobby admin
      this.handleAdminCommand(message, command);
    }
  }

  handleAdminCommand(message, command) {
    if (command[0] === COMMAND_GAME_SETUP_CHOOSE) {
      // Choose command

      if (this.state === STATE_GAME_SETUP_CHOOSING_RULESET) {
        // Ruleset selection
        if (command[1] === GAME_RULESET_AVALON_OPTION_NUM) {
          this.setRuleset(message.channel, GAME_RULESET_AVALON);
        } else if (
          command[1] === GAME_RULESET_AVALON_WITH_TARGETING_OPTION_NUM
        ) {
          this.setRuleset(message.channel, GAME_RULESET_AVALON_WITH_TARGETING);
        } else {
          return;
        }

        moderator.gameSetupChooseRulesetConfirmation(message, this.ruleset);

        // Go to role picking state
        // TODO code this
        message.channel.send(
          'SHOULD HAVE ROLE PICKING STUFF HERE BUT GOING TO CODE SOME GAME STUFF FIRST'
        );
        this.setState(message.channel, STATE_GAME_SETUP_CHOOSING_ROLES);

        // TODO for now skip role picking state, go straight into game
        // TODO delete me later
        this.setState(message.channel, STATE_GAME_SETUP_READY);
      }
    }
  }

  playerIsJoined(user) {
    return this.players.includes(user.id);
  }

  playerIsAdmin(user) {
    return user.id === this.admin;
  }

  setState(channel, state) {
    log.debug(
      `setting game setup state to '${state}' in ${logReprChannel(channel)}`
    );

    this.state = state;
  }

  setRuleset(channel, ruleset) {
    log.debug(
      `setting game setup ruleset to '${ruleset}' in ${logReprChannel(channel)}`
    );

    this.ruleset = ruleset;
  }
}

export default GameSetup;
