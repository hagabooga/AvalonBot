import * as log from 'loglevel';
import {TEAM_SPIES} from './constants';
import {
  ROLES_TABLE,
  ROLE_KEY_ASSASSIN,
  ROLE_KEY_MERLIN,
  ROLE_KEY_MORDRED,
  ROLE_KEY_MORGANA,
  ROLE_KEY_OBERON,
  ROLE_KEY_PERCIVAL,
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
  // be self explanatory
  if (roleKey === ROLE_KEY_MERLIN) {
    // Merlin dialogue, which varies with Mordred being in game
    let spiesPlayerIds = game.findPlayersOnTeam(TEAM_SPIES, [ROLE_KEY_MORDRED]);
    let spiesStr = spiesPlayerIds.map(id => `<@${id}>`).join(', ');

    if (spiesPlayerIds.length === 1) {
      msgToSend += ` ${spiesStr} is revealed to be a spy!`;
    } else if (spiesPlayerIds.length > 1) {
      msgToSend += ` The spies revealed to you are ${spiesStr}.`;
    }

    if (game.isRoleInGame(ROLE_KEY_MORDRED)) {
      msgToSend += ' Mordred remains hidden.';
    }
  } else if (roleKey === ROLE_KEY_PERCIVAL) {
    // Percival dialogue, which varies with whether Morgana is in the
    // game
    let merlinPlayerIds = game.findPlayersWithRoles([
      ROLE_KEY_MERLIN,
      ROLE_KEY_MORGANA,
    ]);
    let merlinsStr = merlinPlayerIds.map(id => `<@${id}>`).join(' and ');

    if (game.isRoleInGame(ROLE_KEY_MORGANA)) {
      msgToSend +=
        ` Two players, ${merlinsStr}, are revealed to you. ` +
        'One of the two players is Merlin and the other is Morgana.';
    } else {
      msgToSend += ` Merlin appears to you and reveals himself as ${merlinsStr}.`;
    }
  } else if (
    [
      ROLE_KEY_VANILLA_SPY,
      ROLE_KEY_ASSASSIN,
      ROLE_KEY_MORGANA,
      ROLE_KEY_MORDRED,
    ].includes(roleKey)
  ) {
    // Non-Oberon spy dialogue, which varies with Oberon being in the
    // game
    let spiesPlayerIds = game
      .findPlayersOnTeam(TEAM_SPIES, [ROLE_KEY_OBERON])
      .filter(id => id !== playerId);
    let spiesStr = spiesPlayerIds.map(id => `<@${id}>`).join(', ');

    if (spiesPlayerIds.length === 1) {
      msgToSend += ` ${spiesStr} is also a spy!`;
    } else if (spiesPlayerIds.length > 1) {
      msgToSend += ` ${spiesStr} are also spies!`;
    }

    if (game.isRoleInGame(ROLE_KEY_OBERON)) {
      msgToSend += ' Oberon remains hidden.';
    }
  } else if (roleKey === ROLE_KEY_OBERON) {
    // Oberon dialogue
    msgToSend += ' Your fellow spies are hidden from you.';
  }

  player
    .send(msgToSend)
    .catch(() =>
      log.error(`failed to send private message to ${logReprUser(player)}`)
    );
};

export {nightPhaseMessage};
