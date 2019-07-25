const Discord = require("discord.js");
const Avalon = require("./avalon.js");
const bot = new Discord.Client();

const token = "NjAzODczOTM3NTY2MzM0OTg2.XToXuQ.B6viM19O438lKi0w9zIrPaD-lEs";
const PREFIX = "!";

var current_game = null;

bot.on("ready", () => {
  console.log("AvalonBot is running...");
  bot.user.setActivity("The Resistance: Avalon");
});

bot.on("message", msg => {
  let message = msg.content;
  if (message === "leg") msg.react("🍗");
  else {
    let args = message.substring(PREFIX.length).split(" ");
    let cmd = args[0];
    if (cmd === "website") {
      msg.channel.send("https://github.com/hagabooga/Avalon_Discord-Bot");
    } else if (cmd === "stats") {
      const embed = new Discord.RichEmbed()
        .setTitle("Statistics")
        .addField("Player", msg.author.username)
        .addField("Winrate", "100%")
        .setThumbnail(msg.author.avatarURL)
        .setColor(0xa83232);
      msg.channel.send(embed);
    } else if (cmd === "avalon") {
      // Game Commands
      if (current_game === null) {
        msg.reply("has created a new Avalon game.");
        current_game = new Avalon.Game(msg.author.username);
      } else {
        msg.reply("a game still in progress.");
      }
    } else if (cmd === "join") {
      if (current_game !== null) {
        let player_id = msg.author.id;
        if (!current_game.players.includes(player_id)) {
          current_game.players.push(msg.author.id);
          msg.reply("has joined the game!");
          //console.log(player_id);
        } else msg.reply("you're already in the current game.");
      }
    } else if (cmd === "stop") {
      if (current_game !== null) {
        msg.reply("stopped the game.");
        delete current_game;
        current_game = null;
      }
    } else if (cmd === "gameinfo") {
      if (current_game !== null) {
        msg.channel.send("Game creator: " + current_game.creator);
      }
    }
  }
});

bot.login(token);
