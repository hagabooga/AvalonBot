import {BOT_WEBSITE} from './constants';

// Help
const help = message => message.channel.send('i c it');

// Website
const website = message => message.channel.send(BOT_WEBSITE);

// Channel initialization
const channelInit = message => message.channel.send('show me');

// Channel status (when neither game lobby nor game are active)
const channelStatus = message => message.channel.send('nothing happening');

// Lobby creation
const lobbyCreate = message =>
  message.channel.send(`new lobby created in ${message.channel.name}`);

// Lobby join
const lobbyJoin = message =>
  message.channel.send(`<@${message.author.id}> u show`);

// Attempted lobby join but already joined
const lobbyAlreadyJoined = message =>
  message.channel.send(`<@${message.author.id}> u already in game`);

// Lobby leave
const lobbyLeave = message =>
  message.channel.send(`<@${message.author.id}> cya nerd`);

// Lobby status
const lobbyStatus = (message, gameLobby) =>
  message.channel.send('this is lobby status');

export default {
  help,
  website,
  channelInit,
  channelStatus,
  lobbyCreate,
  lobbyJoin,
  lobbyAlreadyJoined,
  lobbyLeave,
  lobbyStatus,
};
