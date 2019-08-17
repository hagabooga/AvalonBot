import * as log from "loglevel";
import {
  BOT_WEBSITE,
  COMMAND_HELP,
  COMMAND_PREFIX,
  COMMAND_WEBSITE,
  STATE_NO_GAME
} from "./constants";

class Channel {
  constructor() {
    // Channel state
    this.channel_state = STATE_NO_GAME;
  }

  on_message(message) {
    // Reactions - these are just for fun
    if (message.content === "leg") {
      message.react("🍗");
    } else if (message.content === "trash") {
      message.react("🗑");
    } else if (message.content === "cloud pussy") {
      message.react("☁").then(() => message.react("🐈"));
    }

    // Parse the command if it's a command; else ignore
    if (message.content.startsWith(COMMAND_PREFIX)) {
      this.on_command(
        message,
        message.content.substring(COMMAND_PREFIX.length).split(" ")
      );
    }
  }

  on_command(message, command) {
    if (command[0] === COMMAND_WEBSITE) {
      message.channel.send(BOT_WEBSITE);
    } else if (command[0] === COMMAND_HELP) {
      // TODO add actual help text
      message.channel.send("i c it");
    }
  }
}

export default Channel;
