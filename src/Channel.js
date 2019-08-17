import { COMMAND_INIT_BOT, STATE_NO_GAME } from "./constants";

class Channel {
  constructor() {
    // Channel state
    this.channel_state = STATE_NO_GAME;
  }

  on_message(message) {
    // DEBUG
    if (message.content === "leg") {
      message.react("🍗");
    } else if (message.content === "trash") {
      message.react("🗑");
    } else if (message.content === "cloud pussy") {
      message.react("☁").then(() => message.react("🐈"));
    }
  }
}

export default Channel;
