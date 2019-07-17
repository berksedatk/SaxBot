const config = require('../config.json');
const fs = require('fs');
const Discord = require('discord.js');
const prefix = config.prefix;
const color = require('../data/colors.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

module.exports = {
  name: 'help',
  category: "General",
  description: "Commands of the bot.",
  aliases: ['commands'],
  usage: '[command name]',
  cooldown: 5,
  execute(bot, message, args) {
    const general = [];
    const fun = [];
    const moderation = [];
    const utility = [];
    const misc = [];
    const {
      commands
    } = message.client;

    if (!args.lenght) {
      commands.map(c => {
        if (c.dev) {
          return;
        } else if (c.category === "General") {
          general.push(`${c.name} - ${c.description}`)
        } else if (c.category === "Fun") {
          fun.push(`${c.name} - ${c.description}`)
        } else if (c.category === "Moderation") {
          moderation.push(`${c.name} - ${c.description}`)
        } else if (c.category === "Utility") {
          utility.push(`${c.name} - ${c.description}`)
        } else {
          misc.push(`${c.name} - ${c.description}`)
        }
      });

      let helpEmbed = new Discord.RichEmbed()
        .setTitle("Here are the commands:")
        .setTimestamp()
        .setFooter("Requested by " + message.author.username, message.author.avatarURL)
        .setColor("BLUE")
      if (general[0]) helpEmbed.addField("General Commands:", general)
      if (fun[0]) helpEmbed.addField("Fun Commands:", fun)
      if (moderation[0]) helpEmbed.addField("Moderation Commands:", moderation)
      if (utility[0]) helpEmbed.addField("Utility Commands:", utility)
      if (misc[0]) helpEmbed.addField("Misc. Commands:", misc)
      helpEmbed.setDescription(`You can provide a command to get into details. ${prefix}help <command name>`)

      return message.author.send(helpEmbed)
        .then(() => {
          if (message.channel.type === "dm") return;
          message.react("📩")
        })
        .catch(error => {
          message.reply("It seems like I cant DM you. Please enable your DMs!");
        });
    } else if (args.lenght) {
      const name = args[0].toLowerCase();
      const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

      if (!command) {
        return message.reply(`This command doesn't exists! use ${config.prefix}help to get into commands.`);
      }

      let helpEmbed = new Discord.RichEmbed()
      .setTitle(command.name)
      .setColor("BLUE")
      .setTimestamp()
      .setFooter("Requested by " + message.author.username, message.author.avatarURL)

      if (command.aliases) helpEmbed.addField("**Aliases:**", command.aliases.join(', ')));
      if (command.category) helpEmbed.addField("**Category:**", command.category))
      if (command.description) helpEmbed.addField("**Description:**", command.description));
      if (command.usage) helpEmbed.addField("**Usage:**", prefix + command.name + " " + command.usage));
      if (command.reqPermissions) helpEmbed.addField("**Required Permission(s):", command.reqPermissions.join(', ')));
      if (command.guildOnly) helpEmbed.addField("**Guild Only**", "Command only can be executed in a guild.")
      if (command.cooldown) helpEmbed.addField("**Cooldown:**", command.cooldown + "second(s)"));
      message.channel.send(helpEmbed)
    }
  }
};
