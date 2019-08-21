[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# AvalonBot

| **Note:** this is an active **work in progress**

AvalonBot is a Discord bot which moderates ["The
Resistance"](https://boardgamegeek.com/boardgame/41114/resistance) and
["The Resistance:
Avalon"](https://boardgamegeek.com/boardgame/128882/resistance-avalon)
games. The base ruleset for both games are supported, as well as the
optional "targeting" rule; several home-made roles are also included.

AvalonBot is maintained by [Cameron Hu](https://github.com/hagabooga/)
and [Matt Wiens](https://github.com/mwiens91/) and is licensed under the
GNU General Public License v3.0.

## Setup

The first thing you need to do is set up a Discord app account at the
[Discord Developer
Portal](https://discordapp.com/developers/applications/).

Then, after cloning this repository and installing the required packages
with

```
npm install
```

copy the example `.env` file as follows:

```
cp .env.example .env
```

Fill in your Discord API token.

## Running it

From the root of the repository, Running

```
node -r esm .
```

## Starting the bot

After AvalonBot has been invited and added to your Discord server, type
`!init` in any channel to initialize AvalonBot in that channel. From
there, AvalonBot will guide you through how to use it.
