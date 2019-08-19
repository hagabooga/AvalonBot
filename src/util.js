import chalk from 'chalk';

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

export {
  logFormat,
  logFormatCritical,
  logReprChannel,
  logReprUser,
  getUserFromId,
  getGuildMemberFromUser,
  getGuildMemberFromUserId,
  mapUsersToMentions,
};
