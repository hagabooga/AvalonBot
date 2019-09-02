import * as log from 'loglevel';
import {TEAM_RESISTANCE, TEAM_SPIES} from './constants';
import {
  ROLES_TABLE,
  ROLE_KEY_ASSASSIN,
  ROLE_KEY_JIMMY,
  ROLE_KEY_MERLIN,
  ROLE_KEY_MORDRED,
  ROLE_KEY_MORGANA,
  ROLE_KEY_OBERON,
  ROLE_KEY_PERCIVAL,
  ROLE_KEY_PROPERTY_MANAGER,
  ROLE_KEY_VANILLA_RESISTANCE,
  ROLE_KEY_VANILLA_SPY,
} from './roles';
import {getUserFromId, getGuildMemberFromUserId, logReprUser} from './util';

// TODO show spies and other info here
const nightPhaseMessage = async (playerId, game) => {
  let playerRole = ROLES_TABLE[game.playerRoleTable[playerId]];
  let player = await getUserFromId(game.client, playerId);

  let msgToSend =
    `An Avalon game with ID **${game.id}** ` +
    `has started in **#${game.channel.name}** ` +
    `on server **${game.channel.guild.name}**. ` +
    `You are on the **${playerRole.team}** team ` +
    `with the role **${playerRole.name}**.`;

  player
    .send(msgToSend)
    .catch(() =>
      log.error(`failed to send private message to ${logReprUser(player)}`)
    );
};

export {nightPhaseMessage};
