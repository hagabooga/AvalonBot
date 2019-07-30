require("dotenv").config();
const Discord = require("discord.js");
const Avalon = require("./avalon.js");
const bot = new Discord.Client();
const token = process.env.DISCORD_API_TOKEN;
const PREFIX = "!";

var current_joined_players = {};
var made_lobby = false;
var current_game = null;

bot.on("ready", () => {
  console.log("AvalonBot is running...");
  bot.user.setActivity("The Resistance: Avalon");
});

bot.on("message", msg => {
  let message = msg.content;
  if (message === "leg") msg.react("🍗");
  if (message === "cloud pussy") {
    msg.react("☁").then(() => msg.react("🐈"));
  }
  if (message[0] !== PREFIX) return;
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
      if (made_lobby === false) {
        msg.reply("has created a new Avalon game.");
        made_lobby = true;
      } else {
        msg.reply("a game still in progress.");
      }
    } else if (cmd === "join") {
      if (made_lobby === true) {
        let player_id = msg.author.id;
        if (!current_joined_players.hasOwnProperty(player_id)) {
          current_joined_players[player_id] = msg.author.username;
          msg.reply("has joined the game!");
          //console.log(current_joined_players);
        } else msg.reply("you're already in the current game.");
      }
    } else if (cmd === "stop") {
      if (made_lobby === true) {
        msg.reply("stopped the game.");
        delete current_game;
        made_lobby = false;
        current_joined_players = {};
      }
    } else if (cmd === "gameinfo") {
      if (made_lobby === true) {
        let joined_players_string = "Currently Joined Players: ";

        for (let player in current_joined_players) {
          if (current_joined_players.hasOwnProperty(player)) {
            joined_players_string += current_joined_players[player] + ", ";
          }
        }

        msg.channel.send(joined_players_string.slice(0, -2));
      }
    } else if (cmd === "start") {
      if (made_lobby === true) {
        let special_roles = args.slice(1, args.length);
        for (let role of special_roles) {
          if (!Avalon.special_role_cmd_names.includes(role)) {
            msg.reply(role + ": Special role not found! Cannot start game.");
            return;
          }
        }
        // use this for number of joined players console.log(Object.keys(current_joined_players).length);
        // if (Object.keys(current_joined_players).length === 5) ...
        if (5 === 5) {
          current_game = new Avalon.FivePlayers();
        }
        current_game.players = current_joined_players;
        if (current_game.give_roles(special_roles)) {
          for (let user of Object.keys(current_game.player_roles)) {
            var character = current_game.player_roles[user];
            msg.channel.send(
              "<@" +
                user +
                ">" +
                " has role: " +
                character.name +
                " (" +
                character.role_name +
                ")"
            );
          }
        }
        else {
          msg.channel.send("Cannot start game! Special roles exceeds maximum number of Resistance or Spies!");
        }
      }
    }
  }
});

bot.login(token);
