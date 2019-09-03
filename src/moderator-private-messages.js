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
  ROLE_KEY_VANILLA_SPY,
} from './roles';
import {getUserFromId, logReprUser} from './util';

const nightPhaseMessage = async (playerId, game) => {
  let roleKey = game.playerRoleTable[playerId];
  let role = ROLES_TABLE[roleKey];
  let player = await getUserFromId(game.client, playerId);

  let msgToSend =
    `An Avalon game has started in <#${game.channel.id}> ` +
    `with ID \`${game.id}\`.\n\n` +
    `You have the **${role.name}** role and are on ` +
    `the **${role.team}** team.`;

  // There's a whole bunch of cases here, each of which should hopefully
  // be self explanatory. Note that the Vanilla Resistance role receives
  // no extra dialogue.
  if (roleKey === ROLE_KEY_MERLIN) {
    let spiesPlayerIds = game.findPlayersOnTeam(TEAM_SPIES, [ROLE_KEY_MORDRED]);

    // Merlin dialogue, which varies with Mordred being in game
    msgToSend += `\n\nThe spies are ${spiesPlayerIds
      .map(id => `<@${id}>`)
      .join(', ')}`;

    // if (game.isRoleInGame(ROLE_KEY_MORDRED)) {
    // } else {
    // }
  }

  player
    .send(msgToSend)
    .catch(() =>
      log.error(`failed to send private message to ${logReprUser(player)}`)
    );
};

export {nightPhaseMessage};
