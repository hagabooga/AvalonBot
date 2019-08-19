import * as log from 'loglevel';
import moderator from './moderator';

class GameSetup {
  constructor(message) {
    message.channel.send('this is game setup phase');
  }

  handleCommand(message, command) {
    message.channel.send('sup');
  }
}

export default GameSetup;
