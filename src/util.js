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
