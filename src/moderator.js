import {
  BOT_WEBSITE,
  COMMAND_CHANNEL_INIT,
  COMMAND_GAME_LOBBY_CLAIM_ADMIN,
  COMMAND_GAME_LOBBY_CREATE,
  COMMAND_GAME_LOBBY_JOIN,
  COMMAND_GAME_LOBBY_KICK,
  COMMAND_GAME_LOBBY_LEAVE,
  COMMAND_GAME_LOBBY_STOP,
  COMMAND_HELP,
  COMMAND_PREFIX,
  COMMAND_STATUS,
  COMMAND_WEBSITE,
} from './constants';
import {mapUsersToMentions} from './util';

// Help
const help = message =>
  message.channel.send(
    '**Commands**\n\n' +
      `\`${COMMAND_PREFIX + COMMAND_HELP}\` - display this message\n` +
      `\`${COMMAND_PREFIX + COMMAND_WEBSITE}\`` +
      " - link AvalonBot's source code\n" +
      `\`${COMMAND_PREFIX + COMMAND_STATUS}\`` +
      " - show AvalonBot's status\n" +
      `\`${COMMAND_PREFIX + COMMAND_CHANNEL_INIT}\`` +
      ' - initialize AvalonBot in a channel\n' +
      '\n**Game lobby commands**\n\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_CREATE}\`` +
      ' - create a game lobby\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_JOIN}\`` +
      ' - join a game lobby\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_LEAVE}\`` +
      ' - leave a game lobby\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_STOP}\`` +
      ' - stop a game lobby\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_CLAIM_ADMIN}\`` +
      ' - claim lobby admin (if available)\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_KICK} @user1 @user2 ...\`` +
      ' - kick users from lobby (if admin)\n'
  );

// Website
const website = message => message.channel.send(BOT_WEBSITE);

// Channel initialization
const channelInit = message =>
  message.channel.send(
    `AvalonBot initialized in <#${message.channel.id}>! ` +
      'To start a game lobby type ' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_CREATE}\`. ` +
      `Type \`${COMMAND_PREFIX + COMMAND_HELP}\` for help.`
  );

// Channel status (when neither game lobby nor game are active)
const channelStatus = message =>
  message.channel.send(
    'There is no active game. Type ' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_CREATE}\` to start one!`
  );

// Lobby creation
const lobbyCreate = message =>
  message.channel.send(
    `**${message.member.displayName}** has started a game lobby! ` +
      `Type \`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_JOIN}\` to join.`
  );

// Lobby join
const lobbyJoin = message =>
  message.channel.send(
    `**${message.member.displayName}** has joined the game!`
  );

// Attempted lobby join but already joined
const lobbyAlreadyJoined = message =>
  message.channel.send(`<@${message.author.id}>, you are already in the game!`);

// Lobby force join
const lobbyForceJoin = (message, users) => {
  message.channel.send(
    `${mapUsersToMentions(users, ', ')}, you have been forced to join ` +
      `the game lobby by **${message.member.displayName}**!`
  );
};

// Lobby claim admin
const lobbyClaimAdmin = message =>
  message.channel.send(
    `**${message.member.displayName}** is now the game lobby admin!`
  );

// Attempted admin claim but there's already an admin
const lobbyFailedClaimAdmin = async (message, adminGuildMemberPromise) => {
  let adminGuildMember = await adminGuildMemberPromise;

  message.channel.send(
    `**${adminGuildMember.displayName}** is already the lobby admin!`
  );
};

// Lobby leave
const lobbyLeave = message =>
  message.channel.send(`**${message.member.displayName}** has left the game.`);

// Lobby stop
const lobbyStop = message =>
  message.channel.send(
    'The game lobby has been stopped! Type ' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_CREATE}\` to start a new one.`
  );

// Lobby kick
const lobbyKick = (message, users) =>
  message.channel.send(
    `${mapUsersToMentions(users, ', ')}, you have been kicked from the game ` +
      `lobby by **${message.member.displayName}**!`
  );

// Lobby status
// TODO give lots more info here
const lobbyStatus = (message, gameLobby) =>
  message.channel.send(
    'A game lobby is currently accepting players. Type ' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_JOIN}\` to join!`
  );

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
  lobbyStop,
  lobbyKick,
  lobbyStatus,
};
