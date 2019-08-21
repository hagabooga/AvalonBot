// Game board parameters for various player sizes
const GAME_BOARDS_TABLE = {
  5: {
    numResistance: 3,
    numSpies: 2,
    missionSizes: {
      1: {size: 2, twoFailsRequired: false},
      2: {size: 3, twoFailsRequired: false},
      3: {size: 2, twoFailsRequired: false},
      4: {size: 3, twoFailsRequired: false},
      5: {size: 3, twoFailsRequired: false},
    },
  },
  6: {
    numResistance: 4,
    numSpies: 2,
    missionSizes: {
      1: {size: 2, twoFailsRequired: false},
      2: {size: 3, twoFailsRequired: false},
      3: {size: 4, twoFailsRequired: false},
      4: {size: 3, twoFailsRequired: false},
      5: {size: 4, twoFailsRequired: false},
    },
  },
  7: {
    numResistance: 4,
    numSpies: 3,
    missionSizes: {
      1: {size: 2, twoFailsRequired: false},
      2: {size: 3, twoFailsRequired: false},
      3: {size: 3, twoFailsRequired: false},
      4: {size: 4, twoFailsRequired: true},
      5: {size: 4, twoFailsRequired: false},
    },
  },
  8: {
    numResistance: 5,
    numSpies: 3,
    missionSizes: {
      1: {size: 3, twoFailsRequired: false},
      2: {size: 4, twoFailsRequired: false},
      3: {size: 4, twoFailsRequired: false},
      4: {size: 5, twoFailsRequired: true},
      5: {size: 5, twoFailsRequired: false},
    },
  },
  9: {
    numResistance: 6,
    numSpies: 3,
    missionSizes: {
      1: {size: 3, twoFailsRequired: false},
      2: {size: 4, twoFailsRequired: false},
      3: {size: 4, twoFailsRequired: false},
      4: {size: 5, twoFailsRequired: true},
      5: {size: 5, twoFailsRequired: false},
    },
  },
  10: {
    numResistance: 6,
    numSpies: 4,
    missionSizes: {
      1: {size: 3, twoFailsRequired: false},
      2: {size: 4, twoFailsRequired: false},
      3: {size: 4, twoFailsRequired: false},
      4: {size: 5, twoFailsRequired: true},
      5: {size: 5, twoFailsRequired: false},
    },
  },
};

export {GAME_BOARDS_TABLE};
