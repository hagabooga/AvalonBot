import {
  ROLE_COMPLEXITY_ADVANCED,
  ROLE_COMPLEXITY_BASIC,
  TEAM_RESISTANCE,
  TEAM_SPIES,
} from './constants';
import {GAME_BOARDS_TABLE} from './game-boards';
import {getGuildMemberFromUser, getGuildMemberFromUserId} from './util';

// These keys will also be used as the option key when selecting roles.
const ROLE_KEY_VANILLA_RESISTANCE = 'vr';
const ROLE_KEY_MERLIN = 'ml';
const ROLE_KEY_VANILLA_SPY = 'vs';
const ROLE_KEY_ASSASSIN = 'as';
const ROLE_KEY_PERCIVAL = 'pv';
const ROLE_KEY_PROPERTY_MANAGER = 'pm';
const ROLE_KEY_MORGANA = 'mg';
const ROLE_KEY_MORDRED = 'md';
const ROLE_KEY_OBERON = 'ob';
const ROLE_KEY_JIMMY = 'jm';

const VANILLA_RESISTANCE = {
  name: 'Vanilla Resistance',
  emojiName: '👮Vanilla Resistance',
  complexity: ROLE_COMPLEXITY_BASIC,
  description:
    'The Vanilla Resistance is a Resistance role ' +
    'which has no special powers.',
  strategy:
    'Deduce who the spies are and ensure they do not fail three missions! ' +
    'If Merlin is in the game, deduce who Merlin is ' +
    'and ensure that the spies cannot identify Merlin.',
  team: TEAM_RESISTANCE,
  maxAllowed: 6,
  requires: [],
};

const MERLIN = {
  name: 'Merlin',
  emojiName: '👮Merlin',
  complexity: ROLE_COMPLEXITY_BASIC,
  description:
    'Merlin is a Resistance role who knows which players are spies. ' +
    'If the spies do not fail three missions by game end, the Assassin ' +
    'can attempt to snipe Merlin. If successful, the spies win the game.',
  strategy:
    'Use your knowledge of the spies to steer the game in the right direction ' +
    'while trying to keep your identity secret.',
  team: TEAM_RESISTANCE,
  maxAllowed: 1,
  requires: [ROLE_KEY_ASSASSIN],
};

const VANILLA_SPY = {
  name: 'Vanilla Spy',
  emojiName: '🕵Vanilla Spy',
  complexity: ROLE_COMPLEXITY_BASIC,
  description:
    'The Vanilla Spy role is a Spies role which has no special powers.',
  strategy:
    'Ensure that spies fail at least three missions ' +
    'while trying to keep your spy identity secret. ' +
    'If Merlin is in the game, try to determine which player Merlin is so that ' +
    'the Assassin can snipe him if three missions have not failed by game end.',
  team: TEAM_SPIES,
  maxAllowed: 4,
  requires: [],
};

const ASSASSIN = {
  name: 'Assassin',
  emojiName: '🕵Assassin',
  complexity: ROLE_COMPLEXITY_BASIC,
  description:
    'The Assassin is a Spies role that must be included if Merlin ' +
    'is in the game. If the spies have not failed three missions by game end, ' +
    'the Assassin can attempt to snipe Merlin. If the snipe selection is correct, ' +
    'the spies win the game.',
  strategy:
    'The Assassin should play more-or-less the same as a Vanilla Spy. ' +
    'When sniping Merlin, make sure to discuss with your fellow spies ' +
    'before finalizing the snipe selection!',
  team: TEAM_SPIES,
  maxAllowed: 1,
  requires: [ROLE_KEY_MERLIN],
};

const PERCIVAL = {
  name: 'Percival',
  emojiName: '👮Percival',
  complexity: ROLE_COMPLEXITY_ADVANCED,
  description:
    'Percival is a Resistance role who knows which player Merlin is. ' +
    'If Morgana is in the game, Percival will know which players have the ' +
    'Merlin and Morgana roles, but will not know which role corresponds ' +
    'to which player.',
  strategy: null,
  team: TEAM_RESISTANCE,
  maxAllowed: 1,
  requires: [ROLE_KEY_ASSASSIN, ROLE_KEY_MERLIN],
};

const PROPERTY_MANAGER = {
  name: 'Property Manager',
  emojiName: '👮Property Manager',
  complexity: ROLE_COMPLEXITY_ADVANCED,
  description:
    'The Property Manager is a Resistance role which must fail exactly ' +
    'one mission for the Resistance team to win.',
  strategy: null,
  team: TEAM_RESISTANCE,
  maxAllowed: 6,
  requires: [],
};

const MORGANA = {
  name: 'Morgana',
  emojiName: '🕵Morgana',
  complexity: ROLE_COMPLEXITY_ADVANCED,
  description:
    'Morgana is a Spies role who appears as Merlin to Percival. ' +
    'More specifically, Pericival will know which players have the ' +
    'Merlin and Morgana roles, but will not know which role corresponds ' +
    'to which player.',
  strategy: null,
  team: TEAM_SPIES,
  maxAllowed: 1,
  requires: [ROLE_KEY_PERCIVAL, ROLE_KEY_ASSASSIN, ROLE_KEY_MERLIN],
};

const MORDRED = {
  name: 'Mordred',
  emojiName: '🕵Mordred',
  complexity: ROLE_COMPLEXITY_ADVANCED,
  description:
    'Mordred is a Spies role who is not revealed to Merlin as a spy.',
  strategy: null,
  team: TEAM_SPIES,
  maxAllowed: 1,
  requires: [ROLE_KEY_ASSASSIN, ROLE_KEY_MERLIN],
};

const OBERON = {
  name: 'Oberon',
  emojiName: '🕵Oberon',
  complexity: ROLE_COMPLEXITY_ADVANCED,
  description:
    'Oberon is a Spies role who is hidden from the other spies and ' +
    'does not know which other players are spies.',
  strategy: null,
  team: TEAM_SPIES,
  maxAllowed: 1,
  requires: [],
};

const JIMMY = {
  name: 'Jimmy',
  emojiName: '🕵Jimmy',
  complexity: ROLE_COMPLEXITY_ADVANCED,
  description:
    'Jimmy is a Spies role which must succeed their first mission ' +
    'unless there are already two failed missions.',
  strategy: null,
  team: TEAM_SPIES,
  maxAllowed: 4,
  requires: [],
};

const ROLES_TABLE = {
  [ROLE_KEY_VANILLA_RESISTANCE]: VANILLA_RESISTANCE,
  [ROLE_KEY_MERLIN]: MERLIN,
  [ROLE_KEY_VANILLA_SPY]: VANILLA_SPY,
  [ROLE_KEY_ASSASSIN]: ASSASSIN,
  [ROLE_KEY_PERCIVAL]: PERCIVAL,
  [ROLE_KEY_PROPERTY_MANAGER]: PROPERTY_MANAGER,
  [ROLE_KEY_MORGANA]: MORGANA,
  [ROLE_KEY_MORDRED]: MORDRED,
  [ROLE_KEY_OBERON]: OBERON,
  [ROLE_KEY_JIMMY]: JIMMY,
};

const ROLES_NIGHT_PHASE_FN_TABLE = {
  [ROLE_KEY_VANILLA_RESISTANCE]: VANILLA_RESISTANCE_NIGHT_PHASE_MESSAGE,
  [ROLE_KEY_MERLIN]: MERLIN_NIGHT_PHASE_MESSAGE,
  [ROLE_KEY_VANILLA_SPY]: VANILLA_SPY_NIGHT_PHASE_MESSAGE,
  [ROLE_KEY_ASSASSIN]: ASSASSIN_NIGHT_PHASE_MESSAGE,
  [ROLE_KEY_PERCIVAL]: PERCIVAL_NIGHT_PHASE_MESSAGE,
  [ROLE_KEY_PROPERTY_MANAGER]: PROPERTY_MANAGER_NIGHT_PHASE_MESSAGE,
  [ROLE_KEY_MORGANA]: MORGANA_NIGHT_PHASE_MESSAGE,
  [ROLE_KEY_MORDRED]: MORDRED_NIGHT_PHASE_MESSAGE,
  [ROLE_KEY_OBERON]: OBERON_NIGHT_PHASE_MESSAGE,
  [ROLE_KEY_JIMMY]: JIMMY_NIGHT_PHASE_MESSAGE,
};

// Validate roles and pass along a (possibly empty) array of strings
// containing reasons why the roles are invalid
const validateRoles = (roleKeys, numPlayers) => {
  let errors = [];

  // Ensure that all of the keys are valid
  let uniqueRoleKeys = [...new Set(roleKeys)];

  uniqueRoleKeys
    .filter(key => !Object.keys(ROLES_TABLE).includes(key))
    .forEach(badKey => errors.push(`${badKey} is not a valid role key`));

  // Check that there are sufficiently many players
  if (roleKeys.length !== numPlayers) {
    errors.push(`need exactly ${numPlayers} roles`);
  }

  // Check that there are sufficiently many players for each team
  let numRequiredResistanceRoles = GAME_BOARDS_TABLE[numPlayers].numResistance;
  let numRequiredSpiesRoles = GAME_BOARDS_TABLE[numPlayers].numSpies;

  if (
    roleKeys.reduce(
      (n, key) => n + (ROLES_TABLE[key].team == TEAM_RESISTANCE),
      0
    ) !== numRequiredResistanceRoles
  ) {
    errors.push(`need exactly ${numRequiredResistanceRoles} Resistance roles`);
  }

  if (
    roleKeys.reduce(
      (n, key) => n + (ROLES_TABLE[key].team == TEAM_SPIES),
      0
    ) !== numRequiredSpiesRoles
  ) {
    errors.push(`need exactly ${numRequiredSpiesRoles} Spies roles`);
  }

  // Ensure that the number selected of a given role is sufficiently low
  let validRoleKeys = roleKeys.filter(key =>
    Object.keys(ROLES_TABLE).includes(key)
  );
  let uniqueValidRoleKeys = [...new Set(validRoleKeys)];

  uniqueValidRoleKeys.forEach(key => {
    if (
      validRoleKeys.reduce((n, val) => n + (val === key), 0) >
      ROLES_TABLE[key].maxAllowed
    ) {
      // Use singular or plural for the role depending on the maximum
      // number of the role allowed
      if (ROLES_TABLE[key].maxAllowed === 1) {
        errors.push(
          `there can be at most ${ROLES_TABLE[key].maxAllowed} ` +
            `${ROLES_TABLE[key].name} role`
        );
      } else {
        errors.push(
          `there can be at most ${ROLES_TABLE[key].maxAllowed} ` +
            `${ROLES_TABLE[key].name} roles`
        );
      }
    }
  });

  // Ensure that all role requirements are filled
  uniqueValidRoleKeys.forEach(key =>
    ROLES_TABLE[key].requires.forEach(requirement => {
      if (!uniqueValidRoleKeys.includes(requirement)) {
        errors.push(
          `the ${ROLES_TABLE[key].name} role requires ` +
            `the ${ROLES_TABLE[requirement].name} role`
        );
      }
    })
  );

  return errors;
};

export {
  ROLE_COMPLEXITY_BASIC,
  ROLE_COMPLEXITY_ADVANCED,
  ROLE_KEY_VANILLA_RESISTANCE,
  ROLE_KEY_MERLIN,
  ROLE_KEY_VANILLA_SPY,
  ROLE_KEY_ASSASSIN,
  ROLE_KEY_PERCIVAL,
  ROLE_KEY_PROPERTY_MANAGER,
  ROLE_KEY_MORGANA,
  ROLE_KEY_MORDRED,
  ROLE_KEY_OBERON,
  ROLE_KEY_JIMMY,
  ROLES_TABLE,
  validateRoles,
};
