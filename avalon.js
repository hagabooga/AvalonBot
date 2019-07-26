const special_role_cmd_names = ["pm"]

class Game {
  constructor() {
    this.started = false;
    this.players = {};
    this.player_roles;
    //
    this.num_resistance = 0;
    this.num_spies = 0;
    this.vote_track = 1;
    this.quest_number = 1;
    this.quest_outcomes = [];
    this.round_voting_outcome = [];
    this.round_mission_success_outcome = [];
    this.final_role_list = [];
    this.vanilla_resist = [];
    this.vanilla_spy = [];
    //
  }
  give_roles(special_roles) {
    this.final_role_list = [];
    let resist = 0;
    let spy = 0;
    // get special roles 
    for (let i = 0; i < special_roles.length; i++) {
      let current_special_role = special_roles[i];
      let char;
      if (current_special_role === "pm")
        char = new PropertyManager()

      this.final_role_list.push(char);
      if (char instanceof Resistance) resist += 1;
      else spy += 1;
    }
    // then distribute vanilla roles
    while (resist < this.num_resistance) {
      this.final_role_list.push(this.vanilla_resist.pop());
      resist += 1;
    }
    while (spy < this.num_spies) {
      this.final_role_list.push(this.vanilla_spy.pop());
      spy += 1;
    }
    return this.final_role_list;
  }
}

class FivePlayers extends Game {
  constructor() {
    super();
    this.num_resistance = 3;
    this.num_spies = 2;
    this.vanilla_resist = [
      new Resistance("Leggo"),
      new Resistance("Booga"),
      new Resistance("Oogly")
    ];
    this.vanilla_spy = [new Spy("Long Leg"), new Spy("OKOK")];
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
  constructor() {
    super("Property Manager");
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

module.exports = { FivePlayers, special_role_cmd_names };
