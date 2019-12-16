import * as log from 'loglevel';
import {
  COMMAND_STATUS,
  MISSION_RESULT_FAILED,
  MISSION_RESULT_NULL,
  MISSION_RESULT_SELECTED,
  MISSION_RESULT_SUCCEEDED,
  STATE_GAME_ACCEPTING_MISSION_RESULTS,
  STATE_GAME_CHOOSING_TEAM,
  STATE_GAME_NIGHT_PHASE,
  STATE_GAME_VOTING_ON_TEAM,
} from './constants';
import {GAME_BOARDS_TABLE} from './game-boards';
import moderator from './moderator';
import {nightPhaseMessage} from './moderator-private-messages';
import {ROLES_TABLE} from './roles';
import {
  fisherYatesShuffle,
  getUserFromId,
  logReprChannel,
  logReprUser,
} from './util';

class Game {
  constructor(message, gameId, client, playerIds, roleKeys, ruleset) {
    // The ID of the game
    this.id = gameId;

    // The bot client
    this.client = client;

    // The Discord channel for this lobby
    this.channel = message.channel;

    // The game state
    this.state = STATE_GAME_NIGHT_PHASE;

    // (Randomized) array of player's unique IDs (as strings)
    this.num_players = playerIds.length;
    this.players = fisherYatesShuffle(playerIds);

    // The leader's player ID
    this.leaderIdx = 0;
    this.leader = null;
    this.setLeader();

    // Ruleset
    this.ruleset = ruleset;

    // Assign roles. rolePlayersTable has role keys as keys and arrays
    // of corresponding user IDs (strings) as values. playerRoleTable
    // has user IDs (strings) as keys and corresponding role keys as
    // values.
    this.rolePlayersTable = {};
    this.playerRoleTable = {};
    this.assignRoles(roleKeys);

    // Keep track of mission data
    this.missionSchema = GAME_BOARDS_TABLE[this.num_players].missionSizes;
    this.missionData = {
      1: {result: MISSION_RESULT_SELECTED},
      2: {result: MISSION_RESULT_NULL},
      3: {result: MISSION_RESULT_NULL},
      4: {result: MISSION_RESULT_NULL},
      5: {result: MISSION_RESULT_NULL},
    };
    this.selectedMission = 1;

    // Keep track of number of rejected teams for current mission
    this.numRejects = 0;

    // Perform the night phase
    this.nightPhase();

    // Start the choose mission phase
    this.setState(STATE_GAME_CHOOSING_TEAM);
    moderator.gameMissionChoose(
      message,
      this.missionSchema[this.selectedMission].size,
      this.leader
    );
  }

  handleCommand(message, command) {
    if (command[0] === COMMAND_STATUS) {
      // Inform the player about the status of the lobby
      moderator.gameStatus(message, this);
    }
  }

  isRoleInGame(roleKey) {
    return Object.keys(this.rolePlayersTable).includes(roleKey);
  }

  setState(state) {
    log.debug(
      `setting game state to '${state}' ` + `in ${logReprChannel(this.channel)}`
    );

    this.state = state;
  }

  findPlayersWithRoles(roles, shuffle = true) {
    let matchingPlayerIds = roles.reduce(
      (accumArray, roleKey) =>
        accumArray.concat(this.rolePlayersTable[roleKey]),
      []
    );

    if (shuffle) {
      return fisherYatesShuffle(matchingPlayerIds);
    }

    return matchingPlayerIds;
  }

  findPlayersOnTeam(team, excludedRoleKeys = [], shuffle = true) {
    let selectedRoleKeys = Object.keys(this.rolePlayersTable)
      .filter(roleKey => ROLES_TABLE[roleKey].team === team)
      .filter(roleKey => !excludedRoleKeys.includes(roleKey));

    return this.findPlayersWithRoles(selectedRoleKeys, shuffle);
  }

  assignRoles(roleKeys) {
    // Setup the role-players table
    let uniqueRoleKeys = [...new Set(roleKeys)];

    uniqueRoleKeys.map(key => {
      this.rolePlayersTable[key] = [];
    });

    // Assign players to their roles
    let shuffledRoleKeys = fisherYatesShuffle(roleKeys);

    shuffledRoleKeys.map(async (key, idx) => {
      let playerId = this.players[idx];

      this.rolePlayersTable[key].push(playerId);
      this.playerRoleTable[playerId] = key;

      let player = await getUserFromId(this.client, playerId);
      let verboseRole = ROLES_TABLE[key].name;

      log.debug(
        `assigning ${verboseRole} to ${logReprUser(player)} ` +
          `in ${logReprChannel(this.channel)}`
      );
    });
  }

  nightPhase() {
    // Message each user their assigned role
    this.players.map(playerId => nightPhaseMessage(playerId, this));
  }

  async setLeader() {
    this.leader = this.players[this.leaderIdx];

    let leaderUser = await getUserFromId(this.client, this.leader);

    log.debug(
      `setting ${logReprUser(leaderUser)} to leader ` +
        `in ${logReprChannel(this.channel)}`
    );
  }
}

export default Game;
