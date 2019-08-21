import {
  ROLE_COMPLEXITY_ADVANCED,
  ROLE_COMPLEXITY_BASIC,
  TEAM_RESISTANCE,
  TEAM_SPIES,
} from './constants';
import {GAME_BOARDS_TABLE} from './game-boards';

// These keys will also be used as the option key when selecting roles.
const VANILLA_RESISTANCE_KEY = 'vr';
const MERLIN_KEY = 'ml';
const VANILLA_SPY_KEY = 'vs';
const ASSASSIN_KEY = 'as';
const PERCIVAL_KEY = 'pv';
const MORGANA_KEY = 'mg';
const MORDRED_KEY = 'md';
const OBERON_KEY = 'ob';

const VANILLA_RESISTANCE = {
  name: '👮Vanilla Resistance',
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
  name: '👮Merlin',
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
  requires: [ASSASSIN_KEY],
};

const VANILLA_SPY = {
  name: '🕵Vanilla Spy',
  complexity: ROLE_COMPLEXITY_BASIC,
  description:
    'The Vanilla Spy role is a Spies role which has no special powers.',
  strategy:
    'Ensure that spies fail at least three missions ' +
    'while trying to keep your spy identity secret. ' +
    'If Merlin is in the game, try to determine which player Merlin is so that ' +
    'the assassin can snipe him if three missions have not failed by game end.',
  team: TEAM_SPIES,
  maxAllowed: 4,
  requires: [],
};

const ASSASSIN = {
  name: '🕵Assassin',
  complexity: ROLE_COMPLEXITY_BASIC,
  description:
    'The Assassin is a Spies role that must be included if Merlin ' +
    'is in the game. If the spies have not failed three missions by game end, ' +
    'the Assassin can try to snipe Merlin. If the snipe selection is correct, ' +
    'the spies win the game.',
  strategy:
    'The Assassin should play more-or-less the same as a Vanilla Spy. ' +
    'When sniping Merlin, make sure to discuss with your fellow spies ' +
    'before finalizing the snipe selection!',
  team: TEAM_SPIES,
  maxAllowed: 1,
  requires: [MERLIN_KEY],
};

const PERCIVAL = {
  name: '👮Percival',
  complexity: ROLE_COMPLEXITY_ADVANCED,
  description:
    'Percival is a Resistance role who knows which player Merlin is. ' +
    'If Morgana is in the game, Percival will know which players have the ' +
    'Merlin and Morgana roles, but will not know which role corresponds ' +
    'to which player.',
  strategy: null,
  team: TEAM_RESISTANCE,
  maxAllowed: 1,
  requires: [ASSASSIN_KEY, MERLIN_KEY],
};

const MORGANA = {
  name: '🕵Morgana',
  complexity: ROLE_COMPLEXITY_ADVANCED,
  description:
    'Morgana is a Spies role who appears as Merlin to Percival. ' +
    'More specifically, Pericival will know which players have the ' +
    'Merlin and Morgana roles, but will not know which role corresponds ' +
    'to which player.',
  strategy: null,
  team: TEAM_SPIES,
  maxAllowed: 1,
  requires: [PERCIVAL_KEY, ASSASSIN_KEY, MERLIN_KEY],
};

const MORDRED = {
  name: '🕵Mordred',
  complexity: ROLE_COMPLEXITY_ADVANCED,
  description:
    'Mordred is a Spies role who is not revealed to Merlin as a spy.',
  strategy: null,
  team: TEAM_SPIES,
  maxAllowed: 1,
  requires: [ASSASSIN_KEY, MERLIN_KEY],
};

const OBERON = {
  name: '🕵Oberon',
  complexity: ROLE_COMPLEXITY_ADVANCED,
  description:
    'Oberon is a Spies role who is hidden from the other spies and ' +
    'does not know which other players are spies.',
  strategy: null,
  team: TEAM_SPIES,
  maxAllowed: 1,
  requires: [],
};

const ROLES_TABLE = {
  [VANILLA_RESISTANCE_KEY]: VANILLA_RESISTANCE,
  [MERLIN_KEY]: MERLIN,
  [VANILLA_SPY_KEY]: VANILLA_SPY,
  [ASSASSIN_KEY]: ASSASSIN,
  [PERCIVAL_KEY]: PERCIVAL,
  [MORGANA_KEY]: MORGANA,
  [MORDRED_KEY]: MORDRED,
  [OBERON_KEY]: OBERON,
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
  VANILLA_RESISTANCE_KEY,
  MERLIN_KEY,
  VANILLA_SPY_KEY,
  ASSASSIN_KEY,
  PERCIVAL_KEY,
  MORGANA_KEY,
  MORDRED_KEY,
  OBERON_KEY,
  ROLES_TABLE,
  validateRoles,
};
