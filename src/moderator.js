import {BOT_WEBSITE} from './constants';
import {mapUsersToMentions} from './util';

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

// Lobby force join
const lobbyForceJoin = (message, users) =>
  message.channel.send(`forcejoined ${mapUsersToMentions(users)}`);

// Lobby claim admin
const lobbyClaimAdmin = message =>
  message.channel.send(`<@${message.author.id}> is lobby admin now`);

// Attempted admin claim but there's already an admin
const lobbyFailedClaimAdmin = message =>
  message.channel.send(`<@${message.author.id}> there's already an admin >_>`);

// Lobby leave
const lobbyLeave = message =>
  message.channel.send(`<@${message.author.id}> cya nerd`);

// Lobby kick
const lobbyKick = (message, users) =>
  message.channel.send(`get the fuck out of here ${mapUsersToMentions(users)}`);

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
  lobbyForceJoin,
  lobbyClaimAdmin,
  lobbyFailedClaimAdmin,
  lobbyLeave,
  lobbyKick,
  lobbyStatus,
};
