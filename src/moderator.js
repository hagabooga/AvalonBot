import {
  AVALON_RULEBOOK_URL,
  AVALONBOT_WEBSITE,
  COMMAND_ABOUT,
  COMMAND_CHANNEL_INIT,
  COMMAND_GAME_LOBBY_CLAIM_ADMIN,
  COMMAND_GAME_LOBBY_CREATE,
  COMMAND_GAME_LOBBY_JOIN,
  COMMAND_GAME_LOBBY_KICK,
  COMMAND_GAME_LOBBY_LEAVE,
  COMMAND_GAME_LOBBY_START,
  COMMAND_GAME_LOBBY_STOP,
  COMMAND_GAME_LOBBY_TRANSFER_ADMIN,
  COMMAND_HELP,
  COMMAND_PREFIX,
  COMMAND_RULES,
  COMMAND_STATUS,
  COMMAND_WEBSITE,
  STATE_GAME_LOBBY_ACCEPTING_PLAYERS,
} from './constants';
import {getGuildMemberFromUserId, mapUsersToMentions} from './util';

// Help
const help = message =>
  message.channel.send(
    '**Commands**\n\n' +
      `\`${COMMAND_PREFIX + COMMAND_HELP}\` - display this message\n` +
      `\`${COMMAND_PREFIX + COMMAND_RULES}\`` +
      ' - link the official "The Resistance: Avalon" rulebook\n' +
      `\`${COMMAND_PREFIX + COMMAND_STATUS}\`` +
      " - show AvalonBot's status\n" +
      `\`${COMMAND_PREFIX + COMMAND_CHANNEL_INIT}\`` +
      ' - initialize AvalonBot in a channel\n' +
      `\`${COMMAND_PREFIX + COMMAND_ABOUT}\`` +
      ' - learn about AvalonBot\n' +
      `\`${COMMAND_PREFIX + COMMAND_WEBSITE}\`` +
      " - link AvalonBot's source code\n" +
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
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_START}\`` +
      ' - start a game (if admin)\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_KICK} @user1 @user2 ...\`` +
      ' - kick users from lobby (if admin)\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_TRANSFER_ADMIN} @user\`` +
      ' - transfer admin to another user (if admin)\n'
  );

// Rules
const rules = message =>
  message.channel.send(
    `Linked is the official "The Resistance: Avalon" rulebook: ${AVALON_RULEBOOK_URL}`
  );

// About
const about = message =>
  message.channel.send(
    'AvalonBot is a Discord bot which moderates ' +
      '"The Resistance" and "The Resistance: Avalon" games. ' +
      'The base ruleset for both games are supported, as well as ' +
      'the optional "targeting" rule; home-made roles and ' +
      'customizable quest boards are also included.\n\n' +
      'AvalonBot is maintained by ' +
      'Cameron Hu (@hagabooga) and Matt Wiens (@mwiens91) ' +
      'and is licensed under the GNU General Public License v3.0.'
  );

// Website
const website = message => message.channel.send(AVALONBOT_WEBSITE);

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
const lobbyFailedClaimAdmin = async (message, discordClient, adminId) => {
  let adminGuildMember = await getGuildMemberFromUserId(
    discordClient,
    message.guild,
    adminId
  );

  message.channel.send(
    `**${adminGuildMember.displayName}** is already the lobby admin!`
  );
};

// Lobby admin transfer
const lobbyTransferAdmin = async (message, discordClient, newAdminId) => {
  let newAdminGuildMember = await getGuildMemberFromUserId(
    discordClient,
    message.guild,
    newAdminId
  );

  message.channel.send(
    `**${newAdminGuildMember.displayName}** is now the game lobby admin!`
  );
};

// Attempted admin transfer but mentioned too many users
const lobbyFailedTransferAdmin = message =>
  message.channel.send(`Must select exactly one player to transfer admin to!`);

// Lobby leave
const lobbyLeave = message =>
  message.channel.send(`**${message.member.displayName}** has left the game.`);

// Lobby stop
const lobbyStop = message =>
  message.channel.send(
    'The game lobby has been stopped! Type ' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_CREATE}\` to start a new one.`
  );

// Lobby start
// TODO
const lobbyStart = message =>
  message.channel.send('NOT IMPLEMENTED (i show soon)');

// Lobby kick
const lobbyKick = (message, users) =>
  message.channel.send(
    `${mapUsersToMentions(users, ', ')}, you have been kicked from the game ` +
      `lobby by **${message.member.displayName}**!`
  );

// Lobby status
const lobbyStatus = async (message, gameLobby) => {
  // Build up a message to send and then send it
  let messageToSend = '';

  // The first bit of the message shows the channel state
  if (gameLobby.gameLobbyState === STATE_GAME_LOBBY_ACCEPTING_PLAYERS) {
    messageToSend +=
      'A game lobby is currently accepting players. Type ' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_JOIN}\` to join!`;
  }

  // Add some whitespace
  messageToSend += '\n\n';

  // List the players that have joined
  let playerGuildMemberPromises = gameLobby.players.map(playerId =>
    getGuildMemberFromUserId(gameLobby.client, message.guild, playerId)
  );
  let playerGuildMembers = await Promise.all(playerGuildMemberPromises);
  let playerGuildMemberStrings = playerGuildMembers.map(member => {
    // Show a crown and bold name if lobby admin. Else just display
    // name.
    if (member.id === gameLobby.lobbyAdminId) {
      return `👑**${member.displayName}**`;
    }

    return member.displayName;
  });

  if (playerGuildMemberStrings.length === 0) {
    messageToSend += '**Joined players**: no joined players';
  } else {
    messageToSend += `**Joined players**: ${playerGuildMemberStrings.join(
      ', '
    )}`;
  }

  //Send the message
  message.channel.send(messageToSend);
};

export default {
  help,
  rules,
  about,
  website,
  channelInit,
  channelStatus,
  lobbyCreate,
  lobbyJoin,
  lobbyAlreadyJoined,
  lobbyForceJoin,
  lobbyClaimAdmin,
  lobbyFailedClaimAdmin,
  lobbyTransferAdmin,
  lobbyFailedTransferAdmin,
  lobbyLeave,
  lobbyStop,
  lobbyStart,
  lobbyKick,
  lobbyStatus,
};
