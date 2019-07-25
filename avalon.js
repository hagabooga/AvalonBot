class Game {
  constructor(creator) {
    this.creator = creator;
    this.players = [];
  }
}

class Character {
  constructor(name) {
    this.name = name;
  }

  starting_knowledge() {}

  approve() {}

  reject() {}

  success() {}

  failure() {}

  can_fail() {}
}

class Resistance extends Character {
  constructor(name) {
    super(name);
  }

  can_fail() {
    return false;
  }
}

class PropertyManager extends Resistance {
  constructor(name) {
    super(name);
    this.failed_once = false;
  }

  failure() {
    this.failed_once = true;
  }

  can_fail() {
    return !this.failed_once;
  }
}

class Spy extends Character {
  constructor(name) {
    super(name);
  }

  can_fail() {
    return true;
  }
}

// Resistance Characters

// Spy Characters

module.exports = { Game };
