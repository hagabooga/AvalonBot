import * as log from 'loglevel';
import {
  COMMAND_GAME_DM_SUCCESS,
  COMMAND_GAME_STOP,
  COMMAND_GAME_TEAM,
  COMMAND_STATUS,
  MISSION_OUTCOME_FAIL,
  MISSION_OUTCOME_NULL,
  MISSION_OUTCOME_SUCCESS,
  MISSION_RESULT_FAILED,
  MISSION_RESULT_NULL,
  MISSION_RESULT_SELECTED,
  MISSION_RESULT_SUCCEEDED,
  STATE_GAME_ACCEPTING_MISSION_RESULTS,
  STATE_GAME_CHOOSING_TEAM,
  STATE_GAME_NIGHT_PHASE,
  STATE_GAME_STOPPED,
  STATE_GAME_VOTING_ON_TEAM,
  TEAM_RESISTANCE,
  VICTORY_RESISTANCE_THREE_SUCCESSFUL_MISSIONS,
  VICTORY_SPIES_FIVE_FAILED_VOTES,
  VICTORY_SPIES_THREE_FAILED_MISSIONS,
  VOTE_APPROVED,
  VOTE_NOT_YET_VOTED,
  VOTE_REJECTED,
} from './constants';
import {GAME_BOARDS_TABLE} from './game-boards';
import moderator from './moderator';
import {nightPhaseMessage} from './moderator-private-messages';
import {ROLE_KEY_MERLIN, ROLES_TABLE} from './roles';
import {
  fisherYatesShuffle,
  getUserFromId,
  logReprChannel,
  logReprUser,
} from './util';

class Game {
  constructor(
    message,
    gameId,
    client,
    playerIds,
    roleKeys,
    ruleset,
    cleanupMethod
  ) {
    // The ID of the game
    this.id = gameId;

    // The bot client
    this.client = client;

    // The Discord channel for this lobby and the guild
    this.channel = message.channel;
    this.guild = message.guild;

    // The AvalonBot channel cleanup method
    this.avalonBotGameCleanup = cleanupMethod;

    // The game state
    this.state = STATE_GAME_NIGHT_PHASE;

    // (Randomized) array of player's unique IDs (as strings)
    this.players = fisherYatesShuffle(playerIds);

    // The leader's player ID
    this.leaderIdx = 0;
    this.leader = null;
    this.setLeader();

    // Ruleset
    this.ruleset = ruleset;
    this.hasMerlin = roleKeys.includes(ROLE_KEY_MERLIN);

    // Roles
    this.roles = roleKeys;

    // Assign roles. rolePlayersTable has role keys as keys and arrays
    // of corresponding user IDs (strings) as values. playerRoleTable
    // has user IDs (strings) as keys and corresponding role keys as
    // values.
    this.rolePlayersTable = {};
    this.playerRoleTable = {};
    this.assignRoles(roleKeys);

    // Keep track of mission data
    this.missionSchema = GAME_BOARDS_TABLE[this.players.length].missionSizes;
    this.missionData = {
      1: {result: MISSION_RESULT_SELECTED},
      2: {result: MISSION_RESULT_NULL},
      3: {result: MISSION_RESULT_NULL},
      4: {result: MISSION_RESULT_NULL},
      5: {result: MISSION_RESULT_NULL},
    };
    this.selectedMission = 1;
    this.numFails = 0;
    this.numSuccesses = 0;

    // Keep track of number of rejected teams for current mission
    this.numRejects = 0;

    // Keep track of current team
    this.team = [];

    // Keep track of votes for current team
    this.teamVotes = {};
    this.resetTeamVotes();

    // Keep track of mission outcomes
    this.missionOutcomes = {};

    // Perform the night phase
    this.nightPhase();

    // Start the choose mission phase
    this.setState(STATE_GAME_CHOOSING_TEAM);
    moderator.gameMissionChoose(
      message.channel,
      this.getCurrentMissionSize(),
      this.leader
    );
  }

  async handleDirectMessageCommand(message, command) {
    if (this.playerIsJoined(message.author)) {
      if (
        this.state == STATE_GAME_VOTING_ON_TEAM &&
        !this.playerHasVoted(message.author) &&
        [VOTE_APPROVED, VOTE_REJECTED].includes(command[0])
      ) {
        // Handle team votes
        this.handleDirectMessageTeamVote(message, command);
      } else if (
        this.state == STATE_GAME_ACCEPTING_MISSION_RESULTS &&
        this.team.includes(message.author.id) &&
        !this.playerHasDoneMission(message.author) &&
        [MISSION_OUTCOME_SUCCESS, MISSION_OUTCOME_FAIL].includes(command[0])
      ) {
        // Handle mission outcomes
        this.handleDirectMessageMissionOutcome(message, command);
      }
    }
  }

  async handleDirectMessageTeamVote(message, command) {
    this.teamVotes[message.author.id] = command[0];

    await moderator.gameVoteOnTeamNewVote(
      message,
      this.channel,
      this.guild,
      this
    );

    // Check outcome of the votes
    if (this.findPlayersNotYetVoted().length === 0) {
      // Determine outcome
      let hasPassed = this.doesTeamGoThrough();

      await moderator.gameVoteOnTeamVotingFinished(
        hasPassed,
        this.channel,
        this.guild,
        this
      );

      if (hasPassed) {
        // Setup next phase
        this.setState(STATE_GAME_ACCEPTING_MISSION_RESULTS);
        this.numRejects = 0;
        this.resetTeamVotes();
        this.resetMissionOutcomes();

        moderator.gameMissionPhaseIntro(this.channel, this);
      } else if (this.numRejects === 4) {
        // End game if no more proposed teams left
        this.setState(STATE_GAME_STOPPED);
        this.avalonBotGameCleanup();

        moderator.gameGameOver(
          VICTORY_SPIES_FIVE_FAILED_VOTES,
          this.channel,
          this
        );
      } else {
        // Move to next team voting iteration
        this.numRejects += 1;

        this.setNextLeader();
        this.setState(STATE_GAME_CHOOSING_TEAM);
        this.resetTeamVotes();
        this.resetTeam();

        moderator.gameMissionChoose(
          this.channel,
          this.getCurrentMissionSize(),
          this.leader
        );
      }
    }
  }

  async handleDirectMessageMissionOutcome(message, command) {
    // Only allow spies to fail
    if (
      command[0] === MISSION_OUTCOME_FAIL &&
      ROLES_TABLE[this.playerRoleTable[message.author.id]].team ===
        TEAM_RESISTANCE
    ) {
      message.channel.send(`You must submit ${COMMAND_GAME_DM_SUCCESS}.`);

      return;
    }

    // Outcome is okay
    this.missionOutcomes[message.author.id] = command[0];

    await moderator.gameMissionPhaseNewOutcome(
      message,
      this.channel,
      this.guild,
      this
    );

    // Check for final mission outcome
    if (this.findPlayersNotYetDoneMission().length === 0) {
      // Determine outcome
      let hasSucceeded = this.doesMissionSucceed();

      await moderator.gameMissionPhaseFinished(
        hasSucceeded,
        this.channel,
        this
      );

      // Move to next state
      if (hasSucceeded && this.numSuccesses === 2) {
        if (this.hasMerlin) {
          // TODO
          // Assassination phase
        } else {
          // End game
          this.setState(STATE_GAME_STOPPED);
          this.avalonBotGameCleanup();

          moderator.gameGameOver(
            VICTORY_RESISTANCE_THREE_SUCCESSFUL_MISSIONS,
            this.channel,
            this
          );
        }
      } else if (!hasSucceeded && this.numFails === 2) {
        // End game
        this.setState(STATE_GAME_STOPPED);
        this.avalonBotGameCleanup();

        moderator.gameGameOver(
          VICTORY_SPIES_THREE_FAILED_MISSIONS,
          this.channel,
          this
        );
      } else {
        // Move to next mission
        if (hasSucceeded) {
          this.numSuccesses += 1;
          this.missionData[
            this.selectedMission
          ].result = MISSION_RESULT_SUCCEEDED;
        } else {
          this.numFails += 1;
          this.missionData[this.selectedMission].result = MISSION_RESULT_FAILED;
        }

        // Do next team selection
        this.selectedMission += 1;
        this.missionData[this.selectedMission].result = MISSION_RESULT_SELECTED;

        this.resetTeam();
        this.setNextLeader();
        this.setState(STATE_GAME_CHOOSING_TEAM);

        moderator.gameMissionChoose(
          this.channel,
          this.getCurrentMissionSize(),
          this.leader
        );
      }
    }
  }

  handleCommand(message, command) {
    if (command[0] === COMMAND_STATUS) {
      // Inform the player about the status of the lobby
      moderator.gameStatus(message, this);
    } else if (this.playerIsJoined(message.author)) {
      // Send to method handling commands for active players
      this.handleJoinedPlayerCommand(message, command);
    }
  }

  handleJoinedPlayerCommand(message, command) {
    if (command[0] === COMMAND_GAME_STOP) {
      // Set the game setup state to stopped
      this.setState(STATE_GAME_STOPPED);

      moderator.gameStop(message);
    } else if (this.playerIsLeader(message.author)) {
      // Send to method handling commands for the lobby admin
      this.handleLeaderCommand(message, command);
    }
  }

  handleLeaderCommand(message, command) {
    if (this.state == STATE_GAME_CHOOSING_TEAM) {
      if (command[0] === COMMAND_GAME_TEAM) {
        // Add players to proposed team
        let joinedPlayersToAdd = message.mentions.users.filter(user =>
          this.playerIsJoined(user)
        );

        // Check if we have the required number of players
        if (joinedPlayersToAdd.size !== this.getCurrentMissionSize()) {
          moderator.gameMissionChooseIncorrectNumberOfPlayers(
            message,
            this.getCurrentMissionSize(),
            this.leader
          );

          return;
        }

        // Add players to team
        this.team = joinedPlayersToAdd.map(user => user.id);

        this.setState(STATE_GAME_VOTING_ON_TEAM);
        moderator.gameVoteOnTeam(message, this);
      }
    }
  }

  isRoleInGame(roleKey) {
    return this.roles.includes(roleKey);
  }

  playerIsJoined(user) {
    return this.players.includes(user.id);
  }

  playerIsLeader(user) {
    return user.id === this.leader;
  }

  playerHasVoted(user) {
    return this.teamVotes[user.id] !== VOTE_NOT_YET_VOTED;
  }

  playerHasDoneMission(user) {
    return this.missionOutcomes[user.id] !== MISSION_OUTCOME_NULL;
  }

  findPlayersWithRoles(roles, shuffle = true) {
    let matchingPlayerIds = roles.reduce(
      (accumArray, roleKey) =>
        this.roles.includes(roleKey)
          ? accumArray.concat(this.rolePlayersTable[roleKey])
          : accumArray,
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

  findPlayersNotYetVoted() {
    return Object.keys(this.teamVotes).filter(
      id => this.teamVotes[id] === VOTE_NOT_YET_VOTED
    );
  }

  findPlayersNotYetDoneMission() {
    return Object.keys(this.missionOutcomes).filter(
      id => this.missionOutcomes[id] === MISSION_OUTCOME_NULL
    );
  }

  findNumFailsOnMission() {
    return Object.values(this.missionOutcomes).reduce(
      (count, outcome) => count + (outcome === MISSION_OUTCOME_FAIL ? 1 : 0),
      0
    );
  }

  doesTeamGoThrough() {
    let approveCount = Object.values(this.teamVotes).reduce(
      (count, vote) => count + (vote === VOTE_APPROVED ? 1 : 0),
      0
    );
    let rejectCount = this.players.length - approveCount;

    if (approveCount > rejectCount) {
      return true;
    }

    return false;
  }

  doesMissionSucceed() {
    let failCount = this.findNumFailsOnMission();

    if (
      (this.missionSchema[this.selectedMission].twoFailsRequired &&
        failCount > 1) ||
      (!this.missionSchema[this.selectedMission].twoFailsRequired &&
        failCount > 0)
    ) {
      return false;
    }

    return true;
  }

  setState(state) {
    log.debug(
      `setting game state to '${state}' in ${logReprChannel(this.channel)}`
    );

    this.state = state;
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

  async setLeader() {
    this.leader = this.players[this.leaderIdx];

    let leaderUser = await getUserFromId(this.client, this.leader);

    log.debug(
      `setting ${logReprUser(leaderUser)} to leader ` +
        `in ${logReprChannel(this.channel)}`
    );
  }

  setNextLeader() {
    this.leaderIdx = (this.leaderIdx + 1) % this.players.length;
    this.setLeader();
  }

  nightPhase() {
    // Message each user their assigned role
    this.players.map(playerId => nightPhaseMessage(playerId, this));
  }

  getCurrentMissionSize() {
    return this.missionSchema[this.selectedMission].size;
  }

  resetTeam() {
    this.team = [];
  }

  resetTeamVotes() {
    this.teamVotes = this.players.reduce(
      (accum, player) => ((accum[player] = VOTE_NOT_YET_VOTED), accum),
      {}
    );
  }

  resetMissionOutcomes() {
    this.missionOutcomes = {};
    this.team.forEach(id => (this.missionOutcomes[id] = MISSION_OUTCOME_NULL));
  }
}

export default Game;
