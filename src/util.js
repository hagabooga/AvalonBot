import chalk from 'chalk';

// Log formatting functions
const logColors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

export const logFormat = {
  format(level, name, timestamp) {
    return `${chalk.bold(`[${timestamp}]`)} ${logColors[level.toUpperCase()](
      level
    )}:`;
  },
};

export const logFormatCritical = {
  format(level, name, timestamp) {
    return chalk.red.bold(`[${timestamp}] ${level}:`);
  },
};

// Log representation of common objects
export const logReprChannel = channel =>
  `[Channel id=${channel.id} name='${channel.name}']`;

export const logReprUser = user =>
  `[User id=${user.id} username='${user.username}']`;
