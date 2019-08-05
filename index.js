require("dotenv").config();
const Discord = require("discord.js");
const Avalon = require("./avalon.js");
const bot = new Discord.Client();
const token = process.env.DISCORD_API_TOKEN;
const PREFIX = "!";

var current_joined_players = {};
var channel_lobbies = {};

class ChannelLobby {
  constructor(name) {
    this.name = name;
    this.game = null;
    this.current_joined_players = {};
  }
  gamestate() {
    if (this.game === null) {
      return "Currently awaiting players to join the game. (min 5) Type !join to join the game.";
    }
  }
}

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
    } else if (!channel_lobbies.hasOwnProperty(msg.channel.id)) {
      if (cmd === "avalon") {
        channel_lobbies[msg.channel.id] = new ChannelLobby(msg.channel.name);
        msg.reply(
          `has created a new Avalon game in channel: **${
            channel_lobbies[msg.channel.id].name
          }**`
        );
      }
    } else {
      let lobby = channel_lobbies[msg.channel.id];
      if (cmd === "join") {
        let player_id = msg.author.id;
        if (!lobby.current_joined_players.hasOwnProperty(player_id)) {
          lobby.current_joined_players[player_id] = msg.author.username;
          msg.reply("has joined the game!");
        } else msg.reply("you're already in the current game.");
      } else if (cmd === "stop") {
        msg.reply("stopped the game.");
        delete channel_lobbies[msg.channel.id];
      } else if (cmd === "gameinfo") {
        let joined_players_string = " ";
        for (let player in channel_lobbies[msg.channel.id]
          .current_joined_players) {
          if (lobby.current_joined_players.hasOwnProperty(player)) {
            joined_players_string +=
              lobby.current_joined_players[player] + ", ";
          }
        }
        if (joined_players_string !== " ") {
          joined_players_string = joined_players_string.slice(0, -2);
        }
        msg.channel.send(
          `**Currently Joined Players**:${joined_players_string}\n**Game State**: ${
            lobby.gamestate()
          }`
        );
      } else if (cmd === "start") {
        let special_roles = args.slice(1, args.length);
        for (let role of special_roles) {
          if (!Avalon.special_role_cmd_names.includes(role)) {
            msg.reply(`**${role}**: Special role not found! Cannot start game.`);
            return;
          }
        }
        // use this for number of joined players console.log(Object.keys(current_joined_players).length);
        // if (Object.keys(current_joined_players).length === 5) ...
        if (5 === 5) {
          lobby.game = new Avalon.FivePlayers();
        }
        lobby.game.players = current_joined_players;
        let roles = ""
        if (lobby.game.give_roles(special_roles)) {
          for (let user of Object.keys(lobby.game.player_roles)) {
            var character = lobby.game.player_roles[user];
            roles += `<@${user}> has role: **${character.name}** (${character.role_name})\n`
          }
          msg.channel.send(roles);
        } else {
          msg.channel.send(
            "``Cannot start game! Special roles exceeds maximum number of Resistance or Spies!``"
          );
        }
      }
    }
  }
});

bot.login(token);
