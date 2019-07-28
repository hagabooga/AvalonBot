const special_role_cmd_names = ["pm"]

function getRandomInt(max){
  return Math.floor(Math.random() * Math.floor(max));
}

class Game {
  constructor() {
    this.started = false;
    this.players = {};
    this.player_roles = {};
    //
    this.num_resistance = 0;
    this.num_spies = 0;
    this.vote_track = 1;
    this.quest_number = 1;
    this.quest_outcomes = [];
    this.round_voting_outcome = [];
    this.round_mission_success_outcome = [];
    this.final_role_list = [];
    this.vanilla_resist = [
      new Resistance("Doc, Loyal Servant of Arthur"),
      new Resistance("Booga, Loyal Servant of Arthur"),
      new Resistance("Oogly, Loyal Servant of Arthur"),
      new Resistance("Gregory, Loyal Servant of Arthur"),
      new Resistance("Marth, Loyal Servant of Arthur"),
      new Resistance("Leggo, Loyal Servant of Arthur")
    ];
    this.vanilla_spy = [
      new Spy("Simren, Minion of Mordred"),
      new Spy("Long Limb, Minion of Mordred"),
      new Spy("Long Neck, Minion of Mordred"),
      new Spy("Long Leg, Minion of Mordred")
    ];
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
      else if (current_special_role === "merlin")
        char = new Merlin();

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

    let player_ids = Object.keys(this.players);
    let role_list = this.final_role_list;
    while (player_ids.length > 0) {
      let random_player_index = getRandomInt(player_ids.length);
      let random_player = player_ids[random_player_index];
      let random_role_index = getRandomInt(role_list.length)
      let random_role = role_list[random_role_index];
      this.player_roles[random_player] = random_role;
      player_ids.splice(random_player_index,1);
      role_list.splice(random_role_index,1);
    }
    let i = 1;
    while (role_list.length > 0) {
      let random_role_index = getRandomInt(role_list.length)
      let random_role = role_list[random_role_index];
      this.player_roles["random_player" + i.toString()] = random_role;
      role_list.splice(random_role_index,1);
      i += 1;  
    }
    return this.player_roles;
  }
}

class FivePlayers extends Game {
  constructor() {
    super();
    this.num_resistance = 3;
    this.num_spies = 2;
    
  }
}

class Character {
  constructor(name, role_name) {
    this.name = name;
    this.role_name = role_name;
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
    super(name, "Resistance");
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

class Merlin extends Resistance {
  constructor() {
    super("Merlin");
  }
  starting_knowledge() {

  }
}

class Spy extends Character {
  constructor(name) {
    super(name, "Spy");
  }
  can_fail() {
    return true;
  }
}

class Assassin extends Character {
  constructor() {
    super ("Assassin");
  }
}

// Resistance Characters

// Spy Characters

module.exports = { FivePlayers, special_role_cmd_names };
