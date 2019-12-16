import chalk from 'chalk';
import table from 'text-table';
import {GAME_BOARDS_TABLE} from './game-boards';

// Log formatting functions
const logColors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

const logFormat = {
  format(level, name, timestamp) {
    return `${chalk.bold(`[${timestamp}]`)} ${logColors[level.toUpperCase()](
      level
    )}:`;
  },
};

const logFormatCritical = {
  format(level, name, timestamp) {
    return chalk.red.bold(`[${timestamp}] ${level}:`);
  },
};

// Log representation of common objects
const logReprChannel = channel =>
  `[Channel id=${channel.id} name='${channel.name}']`;

const logReprUser = user => `[User id=${user.id} username='${user.username}']`;

// Discord API helper functions
const getUserFromId = async (discordClient, id) => discordClient.fetchUser(id);

const getGuildMemberFromUser = async (guild, user) => guild.fetchMember(user);

const getGuildMemberFromUserId = async (discordClient, guild, id) =>
  getUserFromId(discordClient, id).then(user =>
    getGuildMemberFromUser(guild, user)
  );

// Moderator helper functions
const mapUsersToMentions = (users, sep = ' ') =>
  users.map(user => `<@${user.id}>`).join(sep);

const mapPlayerIdsToPlayersList = async (
  message,
  client,
  playerIds,
  crownId = null,
  sep = ' '
) => {
  let playerGuildMemberPromises = playerIds.map(playerId =>
    getGuildMemberFromUserId(client, message.guild, playerId)
  );
  let playerGuildMembers = await Promise.all(playerGuildMemberPromises);
  let playerGuildMemberStrings = playerGuildMembers.map(member => {
    // Show a crown and bold name if lobby admin. Else just display
    // name.
    if (member.id === crownId) {
      return `👑**${member.displayName}**`;
    }

    return member.displayName;
  });

  return playerGuildMemberStrings.join(sep);
};

const gameBoardRepresentNoData = numPlayers => {
  let missionSizes = GAME_BOARDS_TABLE[numPlayers].missionSizes;

  let data = Object.keys(missionSizes).reduce(
    (accum, key) => [
      ...accum,
      [key, missionSizes[key].size, missionSizes[key].twoFailsRequired],
    ],
    [
      ['MISSION', 'SIZE', 'TWO FAILS'],
      ['=======', '====', '========='],
    ]
  );

  return table(data);
};

// Fisher-Yates shuffling algorithm
const fisherYatesShuffle = arr => {
  let randArr = [];
  let newArr = arr;

  while (newArr.length !== 0) {
    let idx = Math.floor(newArr.length * Math.random());

    randArr.push(newArr[idx]);
    newArr.splice(idx, 1);
  }
  return randArr;
};

export {
  logFormat,
  logFormatCritical,
  logReprChannel,
  logReprUser,
  getUserFromId,
  getGuildMemberFromUser,
  getGuildMemberFromUserId,
  mapUsersToMentions,
  mapPlayerIdsToPlayersList,
  gameBoardRepresentNoData,
  fisherYatesShuffle,
};
