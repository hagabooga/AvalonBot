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
export const STATE_GAME_SETUP_READY = 'ready';
export const STATE_GAME_SETUP_STOPPED = 'stopped';

// Commands. The values here are the actual commands, but they need to
// be proceeded by COMMAND_PREFIX.
export const COMMAND_PREFIX = '!';
export const COMMAND_ABOUT = 'about';
export const COMMAND_HELP = 'help';
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
export const COMMAND_GAME_SETUP_STOP = 'stop';

// Game settings
export const GAME_SETTINGS_MIN_AVALON_PLAYERS = 5;
export const GAME_SETTINGS_MAX_AVALON_PLAYERS = 10;

// Game rulesets
export const GAME_RULESET_AVALON = 'The Resistance: Avalon';
export const GAME_RULESET_AVALON_WITH_TARGETING =
  'The Resistance: Avalon (with targeting)';
export const GAME_RULESET_RESISTANCE = 'The Resistance';
export const GAME_RULESET_RESISTANCE_WITH_TARGETING =
  'The Resistance (with targeting)';
export const GAME_RULESET_AVALON_OPTION_NUM = '1';
export const GAME_RULESET_AVALON_WITH_TARGETING_OPTION_NUM = '2';
export const GAME_RULESET_RESISTANCE_OPTION_NUM = '3';
export const GAME_RULESET_RESISTANCE_WITH_TARGETING_OPTION_NUM = '4';

// Team names
export const RESISTANCE_TEAM = 'resistance';
export const SPIES_TEAM = 'spies';
