import * as log from "loglevel";
import { COMMAND_INIT_BOT, COMMAND_PREFIX, STATE_NO_GAME } from "./constants";

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
    log.debug("TEST");
  }
}

export default Channel;
