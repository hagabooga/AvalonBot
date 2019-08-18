import * as log from 'loglevel';
import {
  COMMAND_GAME_LOBBY_JOIN,
  STATE_GAME_LOBBY_READY,
} from './constants';
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
      if (this.players.includes(message.author.id)) {
        // User has already joined
        // TODO add a better message
        message.channel.send(`<@${message.author.id}> u already in game`);
      } else {
        // Add the user to the game lobby
        this.players.push(message.author.id);

        log.debug(
          `adding ${logReprUser(
            message.author
          )} to game lobby in ${logReprChannel(message.channel)}`
        );

        // TODO add a better message
        message.channel.send(`<@${message.author.id}> u show`);
      }
    }
  }
}

export default GameLobby;
