import {
  AVALON_RULEBOOK_URL,
  AVALONBOT_WEBSITE,
  COMMAND_ABOUT,
  COMMAND_CHANNEL_DEINIT,
  COMMAND_CHANNEL_INIT,
  COMMAND_GAME_LOBBY_CLAIM_ADMIN,
  COMMAND_GAME_LOBBY_CREATE,
  COMMAND_GAME_LOBBY_JOIN,
  COMMAND_GAME_LOBBY_KICK,
  COMMAND_GAME_LOBBY_LEAVE,
  COMMAND_GAME_LOBBY_START,
  COMMAND_GAME_LOBBY_STOP,
  COMMAND_GAME_LOBBY_TRANSFER_ADMIN,
  COMMAND_GAME_SETUP_CHOOSE,
  COMMAND_GAME_SETUP_CONFIRM,
  COMMAND_GAME_SETUP_RESET,
  COMMAND_GAME_SETUP_STOP,
  COMMAND_HELP,
  COMMAND_HELP_ROLES,
  COMMAND_PREFIX,
  COMMAND_RULES,
  COMMAND_STATUS,
  COMMAND_WEBSITE,
  GAME_RULESET_AVALON,
  GAME_RULESET_AVALON_OPTION_NUM,
  GAME_RULESET_AVALON_WITH_TARGETING,
  GAME_RULESET_AVALON_WITH_TARGETING_OPTION_NUM,
  GAME_SETTINGS_MAX_AVALON_PLAYERS,
  GAME_SETTINGS_MIN_AVALON_PLAYERS,
  ROLE_COMPLEXITY_ADVANCED,
  ROLE_COMPLEXITY_BASIC,
  TEAM_RESISTANCE,
  TEAM_SPIES,
} from './constants';
import {GAME_BOARDS_TABLE} from './game-boards';
import {ROLES_TABLE} from './roles';
import {
  getGuildMemberFromUserId,
  mapPlayerIdsToPlayersList,
  mapUsersToMentions,
} from './util';

// Help
const help = message =>
  message.channel.send(
    '**Commands**\n\n' +
      `\`${COMMAND_PREFIX + COMMAND_HELP}\`` +
      ' - display this message\n' +
      `\`${COMMAND_PREFIX + COMMAND_HELP_ROLES}\`` +
      ' - display all roles\n' +
      `\`${COMMAND_PREFIX + COMMAND_RULES}\`` +
      ' - link the official "The Resistance: Avalon" rulebook\n' +
      `\`${COMMAND_PREFIX + COMMAND_STATUS}\`` +
      ' - show game status\n' +
      `\`${COMMAND_PREFIX + COMMAND_CHANNEL_INIT}\`` +
      ' - initialize AvalonBot in a channel\n' +
      `\`${COMMAND_PREFIX + COMMAND_CHANNEL_DEINIT}\`` +
      ' - remove AvalonBot from a channel\n' +
      `\`${COMMAND_PREFIX + COMMAND_ABOUT}\`` +
      ' - learn about AvalonBot\n' +
      `\`${COMMAND_PREFIX + COMMAND_WEBSITE}\`` +
      " - link AvalonBot's source code\n" +
      '\n**Game lobby commands**\n\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_CREATE}\`` +
      ' - create game lobby\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_JOIN}\`` +
      ' - join game lobby\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_LEAVE}\`` +
      ' - leave game lobby\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_STOP}\`` +
      ' - stop game lobby\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_CLAIM_ADMIN}\`` +
      ' - show lobby admin or claim lobby admin (if available)\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_START}\`` +
      ' - start game (if admin)\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_KICK} @user1 @user2 ...\`` +
      ' - kick users from lobby (if admin)\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_TRANSFER_ADMIN} @user\`` +
      ' - transfer admin to another user (if admin)\n' +
      '\n**Game setup commands**\n\n' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_SETUP_STOP}\`` +
      ' - stop game setup\n'
  );

// Roles help
const roleHelp = message => {
  const formatRole = role => {
    let roleStr = `**${role.name}**\n→ ${role.description}\n`;

    // If role has a strategy, show it
    if (role.strategy === null) return roleStr;

    return roleStr + `→ ${role.strategy}\n`;
  };

  // Send two messages so that the character limit is not exceeded
  message.channel.send(
    `__**Team ${TEAM_RESISTANCE} roles (basic)**__\n\n` +
      Object.values(ROLES_TABLE)
        .filter(
          role =>
            role.team === TEAM_RESISTANCE &&
            role.complexity === ROLE_COMPLEXITY_BASIC
        )
        .map(formatRole)
        .join('\n') +
      '\n' +
      `__**Team ${TEAM_SPIES} roles (basic)**__\n\n` +
      Object.values(ROLES_TABLE)
        .filter(
          role =>
            role.team === TEAM_SPIES &&
            role.complexity === ROLE_COMPLEXITY_BASIC
        )
        .map(formatRole)
        .join('\n')
  );

  message.channel.send(
    `__**Team ${TEAM_RESISTANCE} roles (advanced)**__\n\n` +
      Object.values(ROLES_TABLE)
        .filter(
          role =>
            role.team === TEAM_RESISTANCE &&
            role.complexity === ROLE_COMPLEXITY_ADVANCED
        )
        .map(formatRole)
        .join('\n') +
      '\n' +
      `__**Team ${TEAM_SPIES} roles (advanced)**__\n\n` +
      Object.values(ROLES_TABLE)
        .filter(
          role =>
            role.team === TEAM_SPIES &&
            role.complexity === ROLE_COMPLEXITY_ADVANCED
        )
        .map(formatRole)
        .join('\n')
  );
};
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
      'The base rulesets for both games are supported, as well as ' +
      'the optional "targeting" rule; several home-made roles ' +
      'are also included.\n\n' +
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

// Channel deinitialization
const channelDeinit = message =>
  message.channel.send(`AvalonBot deinitialized in <#${message.channel.id}>.`);

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
const lobbyJoinAlreadyJoined = message =>
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
const lobbyClaimAdminFailed = async (message, discordClient, adminId) => {
  let adminGuildMember = await getGuildMemberFromUserId(
    discordClient,
    message.guild,
    adminId
  );

  message.channel.send(
    `**${adminGuildMember.displayName}** is the lobby admin.`
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
const lobbyTransferAdminTooManyMentions = message =>
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

// Lobby start attempted but not enough players
const lobbyStartNotEnoughPlayers = message =>
  message.channel.send(
    'Must have at least ' +
      `**${GAME_SETTINGS_MIN_AVALON_PLAYERS} players** to start the game!`
  );

// Lobby start attempted but too many players
const lobbyStartTooManyPlayers = message =>
  message.channel.send(
    'Must have at most ' +
      `**${GAME_SETTINGS_MAX_AVALON_PLAYERS} players** to start the game!`
  );

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
  messageToSend +=
    'A game lobby is currently accepting players. Type ' +
    `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_JOIN}\` to join!\n\n`;

  // List the players that have joined
  let playerListString = await mapPlayerIdsToPlayersList(
    message,
    gameLobby.client,
    gameLobby.players,
    gameLobby.admin,
    ', '
  );

  if (gameLobby.players.length === 0) {
    messageToSend += '**Joined players**: no joined players';
  } else {
    messageToSend += `**Joined players**: ${playerListString}`;
  }

  //Send the message
  message.channel.send(messageToSend);
};

// Game setup introduction
const gameSetupIntroduction = (message, adminId) =>
  message.channel.send(`Game setup has started! <@${adminId}>, you're up!`);

// Game setup choose ruleset
const gameSetupChooseRuleset = (message, adminId) =>
  message.channel.send(
    'Please select the game ruleset:\n\n' +
      `**[${GAME_RULESET_AVALON_OPTION_NUM}]** ${GAME_RULESET_AVALON}\n` +
      `**[${GAME_RULESET_AVALON_WITH_TARGETING_OPTION_NUM}]** ` +
      `${GAME_RULESET_AVALON_WITH_TARGETING}\n` +
      `\n<@${adminId}>, type ` +
      `\`${COMMAND_PREFIX + COMMAND_GAME_SETUP_CHOOSE}\` ` +
      'followed by the option number you would like to select.'
  );

// Game setup choose ruleset echo
const gameSetupChooseRulesetConfirmation = (message, ruleset) =>
  message.channel.send(`**${ruleset}** ruleset selected.`);

// Game setup choose roles
const gameSetupChooseRoles = (message, adminId, numPlayers) => {
  let rolesString = Object.entries(ROLES_TABLE)
    .map(([key, role]) => `**[${key}]** ${role.name}`)
    .join('\n');
  let numResistanceRoles = GAME_BOARDS_TABLE[numPlayers].numResistance;
  let numSpiesRoles = GAME_BOARDS_TABLE[numPlayers].numSpies;

  message.channel.send(
    `Please select **${numResistanceRoles} Resistance roles** and ` +
      `**${numSpiesRoles} Spies roles** from the following roles:\n\n${rolesString}` +
      `\n\n<@${adminId}>, type ` +
      `\`${COMMAND_PREFIX + COMMAND_GAME_SETUP_CHOOSE}\` ` +
      'followed by the role keys of the roles you would like to select. ' +
      'You may select the same role multiple times. ' +
      `Type \`${COMMAND_PREFIX + COMMAND_HELP_ROLES}\` ` +
      'to list available roles.'
  );
};

// Game setup choose roles errors
const gameSetupChooseRolesErrors = (message, errors) =>
  message.channel.send(
    '**Invalid role selection**\n\nThe following errors occured:\n' +
      errors.map(error => '→ ' + error).join('\n')
  );

// Game setup confirm setup
const gameSetupConfirm = (message, gameSetup) =>
  message.channel.send(
    `<@${gameSetup.admin}>, please confirm the chosen game setup:\n\n` +
      `**Ruleset**: ${gameSetup.ruleset}\n` +
      `**Roles**: ${gameSetup.roles
        .map(roleKey => ROLES_TABLE[roleKey].name)
        .join(', ')}` +
      '\n\n' +
      `Type \`${COMMAND_PREFIX + COMMAND_GAME_SETUP_CONFIRM}\` ` +
      'to start the game or type ' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_SETUP_RESET}\` to pick a new setup.`
  );

// Game setup stop
const gameSetupStop = message =>
  message.channel.send(
    'Game setup has been stopped! Type ' +
      `\`${COMMAND_PREFIX + COMMAND_GAME_LOBBY_CREATE}\` ` +
      'to start a new game lobby.'
  );

// Game setup status
const gameSetupStatus = async (message, gameSetup) => {
  // Build up a message to send and then send it
  let messageToSend = '';

  // Introductory message
  let adminGuildMember = await getGuildMemberFromUserId(
    gameSetup.client,
    message.guild,
    gameSetup.admin
  );

  messageToSend +=
    `Hang tight, **${adminGuildMember.displayName}** is currently ` +
    'setting up the game.\n\n';

  // List the players
  let playerListString = await mapPlayerIdsToPlayersList(
    message,
    gameSetup.client,
    gameSetup.players,
    gameSetup.admin,
    ', '
  );

  messageToSend += `**Players**: ${playerListString}\n`;

  // List the ruleset
  if (gameSetup.ruleset === null) {
    messageToSend += '**Ruleset**: not yet selected\n';
  } else {
    messageToSend += `**Ruleset**: ${gameSetup.ruleset}\n`;
  }

  // List the roles chosen
  if (gameSetup.roles.length === 0) {
    messageToSend += '**Roles**: not yet selected\n';
  } else {
    messageToSend += `**Roles**: ${gameSetup.roles
      .map(roleKey => ROLES_TABLE[roleKey].name)
      .join(', ')}\n`;
  }

  // Show game board
  // TODO actually show game board
  messageToSend += '**Game board**: show game board here\n';

  //Send the message
  message.channel.send(messageToSend);
};

export default {
  help,
  roleHelp,
  rules,
  about,
  website,
  channelInit,
  channelDeinit,
  channelStatus,
  lobbyCreate,
  lobbyJoin,
  lobbyJoinAlreadyJoined,
  lobbyForceJoin,
  lobbyClaimAdmin,
  lobbyClaimAdminFailed,
  lobbyTransferAdmin,
  lobbyTransferAdminTooManyMentions,
  lobbyLeave,
  lobbyStop,
  lobbyStartNotEnoughPlayers,
  lobbyStartTooManyPlayers,
  lobbyKick,
  lobbyStatus,
  gameSetupIntroduction,
  gameSetupChooseRuleset,
  gameSetupChooseRulesetConfirmation,
  gameSetupChooseRoles,
  gameSetupChooseRolesErrors,
  gameSetupConfirm,
  gameSetupStop,
  gameSetupStatus,
};
