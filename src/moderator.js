import {BOT_WEBSITE} from './constants';

// Help
const help = message => message.channel.send('i c it');

// Website
const website = message => message.channel.send(BOT_WEBSITE);

// Channel initialization
const channelInit = message => message.channel.send('show me');

// Lobby creation
const lobbyCreate = message =>
  message.channel.send(`new lobby created in ${message.channel.name}`);

// Lobby join
const lobbyJoin = message =>
  message.channel.send(`<@${message.author.id}> u show`);

// Lobby but already joined
const lobbyAlreadyJoined = message =>
  message.channel.send(`<@${message.author.id}> u already in game`);

export default {
  channelInit,
  help,
  lobbyAlreadyJoined,
  lobbyCreate,
  lobbyJoin,
  website,
};
