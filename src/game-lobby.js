import * as log from 'loglevel';
import {
  COMMAND_GAME_LOBBY_FORCE_JOIN,
  COMMAND_GAME_LOBBY_JOIN,
  COMMAND_GAME_LOBBY_LEAVE,
  COMMAND_GAME_LOBBY_STATUS,
} from './constants';
import moderator from './moderator';
import {logReprChannel, logReprUser} from './util';

class GameLobby {
  constructor(message, forceJoinEnabled) {
    // Game lobby state
    this.gameLobbyState = null;

    // Setting for whether to allow the force join command
    this.forceJoinEnabled = forceJoinEnabled;

    // Array of joined player's unique IDs (as strings)
    this.players = [];
    this.addPlayer(message.author, message.channel);

    // Lobby admin's unique ID (as string). Note that we set it to null
    // initially so that the setAdmin function isn't modifying a
    // variable that doesn't exist.
    this.lobbyAdmin = null;
    this.setAdmin(message.author, message.channel);
  }

  handleCommand(message, command) {
    if (command[0] === COMMAND_GAME_LOBBY_JOIN) {
      // Player wants to join the game. Check if player is already in
      // the game; if not, add them to the lobby
      if (this.players.includes(message.author.id)) {
        moderator.lobbyAlreadyJoined(message);
      } else {
        this.addPlayer(message.author, message.channel);

        moderator.lobbyJoin(message);
      }
    } else if (command[0] === COMMAND_GAME_LOBBY_FORCE_JOIN) {
      // Force players to join the game. Filter players which aren't in
      // the game and add them in.
      let newPlayers = message.mentions.users.filter(
        user => !this.players.includes(user.id)
      );

      this.addPlayers(newPlayers, message.channel);

      moderator.lobbyForceJoin(message, newPlayers);
    } else if (command[0] === COMMAND_GAME_LOBBY_LEAVE) {
      // Player wants to leave the game. Check if player is already in
      // the game and remove them if so; otherwise ignore.
      if (this.players.includes(message.author.id)) {
        this.removePlayer(message.author, message.channel);

        moderator.lobbyLeave(message);
      }
    } else if (command[0] === COMMAND_GAME_LOBBY_STATUS) {
      // Inform the player about the status of the lobby
      moderator.lobbyStatus(message, this);
    }
  }

  addPlayer(user, channel) {

    log.debug(
      `adding ${logReprUser(user)} to game lobby in ${logReprChannel(channel)}`
    );

    this.players.push(user.id);
  }

  addPlayers(users, channel) {
    users.forEach(user => this.addPlayer(user, channel));
  }

  removePlayer(user, channel) {
    log.debug(
      `removing ${logReprUser(user)} from game lobby in ${logReprChannel(
        channel
      )}`
    );

    this.players = this.players.filter(id => id !== user.id);
  }

  removePlayers(users, channel) {
    users.forEach(user => this.removePlayer(user, channel));
  }

  setAdmin(user, channel) {
    log.debug(
      `setting ${logReprUser(user)} as game lobby admin in ${logReprChannel(
        channel
      )}`
    );

    this.lobbyAdmin = user.id;
  }
}

export default GameLobby;
