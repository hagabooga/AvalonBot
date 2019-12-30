// Links
export const AVALONBOT_WEBSITE = 'https://github.com/hagabooga/AvalonBot';
export const AVALON_RULEBOOK_URL = 'https://waa.ai/3VX0';

// Channel states
export const STATE_CHANNEL_LOBBY = 'lobby';
export const STATE_CHANNEL_SETUP = 'setup';
export const STATE_CHANNEL_GAME = 'game';

// Game lobby states
export const STATE_GAME_LOBBY_ACCEPTING_PLAYERS = 'accepting players';
export const STATE_GAME_LOBBY_READY = 'ready';
export const STATE_GAME_LOBBY_STOPPED = 'stopped';

// Game setup states
export const STATE_GAME_SETUP_CHOOSING_RULESET = 'choosing ruleset';
export const STATE_GAME_SETUP_CHOOSING_ROLES = 'choosing roles';
export const STATE_GAME_SETUP_CONFIRMING_SETUP = 'confirming setup';
export const STATE_GAME_SETUP_READY = 'ready';
export const STATE_GAME_SETUP_STOPPED = 'stopped';

// Game states
export const STATE_GAME_NIGHT_PHASE = 'night phase';
export const STATE_GAME_CHOOSING_TEAM = 'choosing mission';
export const STATE_GAME_VOTING_ON_TEAM = 'voting on team';
export const STATE_GAME_ACCEPTING_MISSION_RESULTS = 'accepting mission results';
export const STATE_GAME_ASSASSINATION = 'assassination phase';
export const STATE_GAME_STOPPED = 'stopped';

// Commands. The values here are the actual commands, but they need to
// be preceded by COMMAND_PREFIX.
export const COMMAND_PREFIX = '!';
export const COMMAND_ABOUT = 'about';
export const COMMAND_HELP = 'help';
export const COMMAND_HELP_ROLES = 'roles';
export const COMMAND_RULES = 'rules';
export const COMMAND_WEBSITE = 'website';
export const COMMAND_STATUS = 'status';
export const COMMAND_CHANNEL_INIT = 'init';
export const COMMAND_CHANNEL_DEINIT = 'deinit';
export const COMMAND_GAME_LOBBY_CREATE = 'avalon';
export const COMMAND_GAME_LOBBY_JOIN = 'join';
export const COMMAND_GAME_LOBBY_FORCE_JOIN = 'forcejoin';
export const COMMAND_GAME_LOBBY_CLAIM_ADMIN = 'admin';
export const COMMAND_GAME_LOBBY_TRANSFER_ADMIN = 'transferadmin';
export const COMMAND_GAME_LOBBY_LEAVE = 'leave';
export const COMMAND_GAME_LOBBY_START = 'start';
export const COMMAND_GAME_LOBBY_STOP = 'stop';
export const COMMAND_GAME_LOBBY_KICK = 'kick';
export const COMMAND_GAME_SETUP_CHOOSE = 'choose';
export const COMMAND_GAME_SETUP_CONFIRM = 'confirm';
export const COMMAND_GAME_SETUP_RESET = 'reset';
export const COMMAND_GAME_SETUP_STOP = 'stop';
export const COMMAND_GAME_PINGALL = 'pingall';
export const COMMAND_GAME_STOP = 'stop';
export const COMMAND_GAME_TEAM = 'team';
export const COMMAND_GAME_ASSASSINATE = 'assassinate';
export const COMMAND_GAME_DM_APPROVE = 'approve';
export const COMMAND_GAME_DM_REJECT = 'reject';
export const COMMAND_GAME_DM_SUCCESS = 'success';
export const COMMAND_GAME_DM_FAIL = 'fail';

// Game settings
export const GAME_SETTINGS_MIN_AVALON_PLAYERS = 5;
export const GAME_SETTINGS_MAX_AVALON_PLAYERS = 10;

// Game rulesets
export const GAME_RULESET_AVALON = 'The Resistance: Avalon';
export const GAME_RULESET_AVALON_OPTION_NUM = '1';

// Role attributes
export const ROLE_COMPLEXITY_BASIC = 'basic role';
export const ROLE_COMPLEXITY_ADVANCED = 'advanced role';

// Team names
export const TEAM_RESISTANCE = 'Resistance';
export const TEAM_SPIES = 'Spies';

// Mission results
export const MISSION_RESULT_NULL = '';
export const MISSION_RESULT_SELECTED = 'selected';
export const MISSION_RESULT_SUCCEEDED = 'succeessful';
export const MISSION_RESULT_FAILED = 'failed';

// Vote results
export const VOTE_NOT_YET_VOTED = 'not yet voted';
export const VOTE_APPROVED = 'approve';
export const VOTE_REJECTED = 'reject';

// Individual mission outcomes
export const MISSION_OUTCOME_NULL = 'no outcome';
export const MISSION_OUTCOME_SUCCESS = 'success';
export const MISSION_OUTCOME_FAIL = 'fail';

// Game outcomes (prior to an optional assassination attempt)
export const VICTORY_RESISTANCE_THREE_SUCCESSFUL_MISSIONS =
  'three successful missions';
export const VICTORY_RESISTANCE_ASSASSINATION_FAILED = 'assassination failed';
export const VICTORY_SPIES_FIVE_FAILED_VOTES = 'file failed votes';
export const VICTORY_SPIES_THREE_FAILED_MISSIONS = 'three failed missoins';
export const VICTORY_SPIES_PROPERTY_MANAGER_NOT_FAILED = 'bad property manager';
export const VICTORY_SPIES_ASSASSINATION_SUCCESSFUL =
  'assassination successful';

// Tenses for moderator messages
export const TENSE_PAST = 'past';
export const TENSE_PRESENT = 'present';
