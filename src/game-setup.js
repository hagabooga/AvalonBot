import * as log from 'loglevel';
import {
  COMMAND_GAME_SETUP_CHOOSE,
  COMMAND_GAME_SETUP_CONFIRM,
  COMMAND_GAME_SETUP_RESET,
  COMMAND_GAME_SETUP_STOP,
  COMMAND_STATUS,
  GAME_RULESET_AVALON,
  GAME_RULESET_AVALON_OPTION_NUM,
  STATE_GAME_SETUP_CHOOSING_ROLES,
  STATE_GAME_SETUP_CHOOSING_RULESET,
  STATE_GAME_SETUP_CONFIRMING_SETUP,
  STATE_GAME_SETUP_READY,
  STATE_GAME_SETUP_STOPPED,
} from './constants';
import moderator from './moderator';
import {ROLES_TABLE, validateRoles} from './roles';
import {logReprChannel} from './util';

class GameSetup {
  constructor(message, client, adminId, playerIds) {
    // The bot client
    this.client = client;

    // The Discord channel for this lobby
    this.channel = message.channel;

    // The game setup state
    this.state = STATE_GAME_SETUP_CHOOSING_RULESET;

    // The lobby admin
    this.admin = adminId;

    // Array of player's unique IDs (as strings)
    this.players = playerIds;

    // The game ruleset
    this.ruleset = null;

    // The roles in the game (just storing the keys)
    this.roles = [];

    // Send welcome message and send ruleset choosing message
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
      this.setState(STATE_GAME_SETUP_STOPPED);

      moderator.gameSetupStop(message);
    } else if (this.playerIsAdmin(message.author)) {
      // Send to method handling commands for the lobby admin
      this.handleAdminCommand(message, command);
    }
  }

  handleAdminCommand(message, command) {
    if (command[0] === COMMAND_GAME_SETUP_RESET) {
      // Reset setup phase
      this.setState(STATE_GAME_SETUP_CHOOSING_RULESET);

      if (this.roles.length > 0) {
        this.unsetRoles();
      }

      if (this.ruleset !== null) {
        this.unsetRuleset();
      }

      moderator.gameSetupChooseRuleset(message, this.admin);
    } else if (this.state === STATE_GAME_SETUP_CHOOSING_RULESET) {
      // Ruleset selection
      if (command[0] === COMMAND_GAME_SETUP_CHOOSE) {
        if (command[1] === GAME_RULESET_AVALON_OPTION_NUM) {
          this.setRuleset(GAME_RULESET_AVALON);
        } else {
          return;
        }

        moderator.gameSetupChooseRulesetConfirmation(message, this.ruleset);

        // Go to role picking state
        this.setState(STATE_GAME_SETUP_CHOOSING_ROLES);
        moderator.gameSetupChooseRoles(
          message,
          this.admin,
          this.players.length
        );
      }
    } else if (this.state === STATE_GAME_SETUP_CHOOSING_ROLES) {
      if (command[0] === COMMAND_GAME_SETUP_CHOOSE) {
        // Role selection - validate and if okay, go to confirmation
        // phase
        let roles = command.slice(1);
        let roleSelectionErrors = validateRoles(roles, this.players.length);

        if (roleSelectionErrors.length !== 0) {
          moderator.gameSetupChooseRolesErrors(message, roleSelectionErrors);

          // Re-echo the role picking dialogue
          moderator.gameSetupChooseRoles(
            message,
            this.admin,
            this.players.length
          );

          return;
        }

        // Valid. Set the roles.
        this.setRoles(roles);

        // Go to confirmation state
        this.setState(STATE_GAME_SETUP_CONFIRMING_SETUP);
        moderator.gameSetupConfirm(message, this);
      }
    } else if (this.state === STATE_GAME_SETUP_CONFIRMING_SETUP) {
      if (command[0] === COMMAND_GAME_SETUP_CONFIRM) {
        // Start the game
        this.setState(STATE_GAME_SETUP_READY);
      }
    }
  }

  playerIsJoined(user) {
    return this.players.includes(user.id);
  }

  playerIsAdmin(user) {
    return user.id === this.admin;
  }

  setState(state) {
    log.debug(
      `setting game setup state to '${state}' ` +
        `in ${logReprChannel(this.channel)}`
    );

    this.state = state;
  }

  setRuleset(ruleset) {
    log.debug(
      `setting game ruleset to '${ruleset}' ` +
        `in ${logReprChannel(this.channel)}`
    );

    this.ruleset = ruleset;
  }

  unsetRuleset() {
    log.debug(`unsetting game ruleset in ${logReprChannel(this.channel)}`);

    this.ruleset = null;
  }

  setRoles(roles) {
    log.debug(`adding roles to game in ${logReprChannel(this.channel)}`);

    this.roles = roles.sort((key1, key2) =>
      ROLES_TABLE[key1].emojiName.localeCompare(ROLES_TABLE[key2].emojiName)
    );
  }

  unsetRoles() {
    log.debug(`removing roles from game in ${logReprChannel(this.channel)}`);

    this.roles = [];
  }
}

export default GameSetup;
