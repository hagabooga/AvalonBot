import { NO_GAME_STATE } from "./constants";

class Channel {
  constructor() {
    // Channel state
    this.channel_state = NO_GAME_STATE;
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
