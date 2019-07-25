const Discord = require("discord.js");
const Avalon = require("./avalon.js");
const bot = new Discord.Client();

const token = "NjAzODczOTM3NTY2MzM0OTg2.XTl4Og.yMMpcscM1kgrqQFaZixwgxB3684";
const PREFIX = "!";

var current_game = null;

bot.on("ready", () => {
  console.log("AvalonBot is running...");
  bot.user.setActivity("The Resistance: Avalon");
});

bot.on("message", msg => {
  let message = msg.content;

  if (message === "leg") {
    msg.react("🍗");
  } else {
    let args = message.substring(PREFIX.length).split(" ");

    switch (args[0]) {
      case "website":
        msg.channel.send("https://github.com/hagabooga/Avalon_Discord-Bot");
        break;

      // case "clear":
      //     if (!args[1]) return msg.reply("Error. Needs second arg");
      //     msg.channel.bulkDelete(args[1]); break;

      case "stats":
        const embed = new Discord.RichEmbed()
          .setTitle("Statistics")
          .addField("Player", msg.author.username)
          .addField("Winrate", "100%")
          .setThumbnail(msg.author.avatarURL)
          .setColor(0xa83232);
        msg.channel.send(embed);
        break;

      // Game Commands
      case "avalon":
        if (current_game === null) {
          msg.reply("has created a new Avalon game.");
          current_game = new Avalon.Game(msg.author.username);
        } else {
          msg.reply("a game still in progress.");
        }
        break;

      case "join":
        if (current_game !== null) {
          let player_id = msg.author.id;
          if (!current_game.players.includes(player_id)) {
            current_game.players.push(msg.author.id);
            msg.reply("has joined the game!");
            //console.log(player_id);
          } else msg.reply("you're already in the current game.");
        }
        break;

      case "stop":
        if (current_game !== null) {
          msg.reply("stopped the game.");
          delete current_game;
          current_game = null;
        }

      case "gameinfo":
        if (current_game !== null) {
          msg.channel.send("Game creator: " + current_game.creator);
        }
        break;
    }
  }
});

bot.login(token);
