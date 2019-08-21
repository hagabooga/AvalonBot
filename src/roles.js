import {
  ROLE_COMPLEXITY_ADVANCED,
  ROLE_COMPLEXITY_BASIC,
  TEAM_RESISTANCE,
  TEAM_SPIES,
} from './constants';

// These keys will also be used as the option key when selecting roles.
const VANILLA_RESISTANCE_KEY = 'vr';
const VANILLA_SPY_KEY = 'vs';
const MERLIN_KEY = 'ml';
const ASSASSIN_KEY = 'as';
const PERCIVAL_KEY = 'pv';

const VANILLA_RESISTANCE = {
  name: 'Vanilla Resistance',
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

const VANILLA_SPY = {
  name: 'Vanilla Spy',
  complexity: ROLE_COMPLEXITY_BASIC,
  description:
    'The Vanilla Spy role is a Spies role which has no special powers.',
  strategy:
    'Ensure that spies fail at least three missions ' +
    'while trying to keep your spy identity secret! ' +
    'If Merlin is in the game, try to determine which player Merlin is so that ' +
    'the assassin can snipe him if three missions have not failed by game end.',
  team: TEAM_SPIES,
  maxAllowed: 4,
  requires: [],
};

const MERLIN = {
  name: 'Merlin',
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

const ASSASSIN = {
  name: 'Assassin',
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
  name: 'Percival',
  complexity: ROLE_COMPLEXITY_ADVANCED,
  description:
    'Percival is a Resistance role who knows who Merlin is. ' +
    'If Morgana is in the game, Percival will know the players with the ' +
    'Merlin and Morgana roles, but will not know which role corresponds ' +
    'to which player.',
  strategy: null,
  team: TEAM_RESISTANCE,
  maxAllowed: 1,
  requires: [ASSASSIN_KEY, MERLIN_KEY],
};

const ROLES_TABLE = {
  [VANILLA_RESISTANCE_KEY]: VANILLA_RESISTANCE,
  [VANILLA_SPY_KEY]: VANILLA_SPY,
  [MERLIN_KEY]: MERLIN,
  [ASSASSIN_KEY]: ASSASSIN,
  [PERCIVAL_KEY]: PERCIVAL,
};

export {
  ROLE_COMPLEXITY_BASIC,
  ROLE_COMPLEXITY_ADVANCED,
  VANILLA_RESISTANCE_KEY,
  VANILLA_SPY_KEY,
  MERLIN_KEY,
  ASSASSIN_KEY,
  PERCIVAL_KEY,
  ROLES_TABLE,
};
