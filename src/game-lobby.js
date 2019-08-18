import * as log from 'loglevel';
import {
  COMMAND_GAME_LOBBY_JOIN,
  COMMAND_GAME_LOBBY_LEAVE,
  COMMAND_GAME_LOBBY_STATUS,
  STATE_GAME_LOBBY_READY,
} from './constants';
import moderator from './moderator';
import {logReprChannel, logReprUser} from './util';

class GameLobby {
  constructor() {
    // Game lobby state
    this.gameLobbyState = null;

    // Array of joined player's unique IDs (as strings)
    this.players = [];
  }

  handleCommand(message, command) {
    if (command[0] === COMMAND_GAME_LOBBY_JOIN) {
      // Player wants to join the game. Check if player is already in
      // the game; if not, add them to the lobby
      if (this.players.includes(message.author.id)) {
        moderator.lobbyAlreadyJoined(message);
      } else {
        this.addPlayer(message.author.id);

        log.debug(
          `adding ${logReprUser(
            message.author
          )} to game lobby in ${logReprChannel(message.channel)}`
        );

        moderator.lobbyJoin(message);
      }
    } else if (command[0] === COMMAND_GAME_LOBBY_LEAVE) {
      // Player wants to leave the game. Check if player is already in
      // the game and remove them if so; otherwise ignore.
      if (this.players.includes(message.author.id)) {
        this.removePlayer(message.author.id);

        log.debug(
          `removing ${logReprUser(
            message.author
          )} from game lobby in ${logReprChannel(message.channel)}`
        );

        moderator.lobbyLeave(message);
      }
    } else if (command[0] === COMMAND_GAME_LOBBY_STATUS) {
      // Inform the player about the status of the lobby
      moderator.lobbyStatus(message, this);
    }
  }

  addPlayer(playerId) {
    this.players.push(playerId);
  }

  removePlayer(playerId) {
    this.players = this.players.filter(id => id !== playerId);
  }
}

export default GameLobby;
