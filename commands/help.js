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
  description: "Shows up the commands of the Gladiator.",
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
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("That\'s not a valid command, use &help to get list of the commands.");
    }

    data.push(helpEmbed = new Discord.RichEmbed());
    data.push(helpEmbed.setTitle(command.name));
    data.push(helpEmbed.setColor(color.blue));
    data.push(helpEmbed.setTimestamp());
    data.push(helpEmbed.setAuthor(bot.user.username, bot.user.avatarURL));

    if (command.aliases) data.push(helpEmbed.addField("**Aliases:**", command.aliases.join(', ')));
    if (command.category) data.push(helpEmbed.addField("**Category:**", command.category))
    if (command.description) data.push(helpEmbed.addField("**Description:**", command.description));
    if (command.usage) data.push(helpEmbed.addField("**Usage:**", prefix + command.name + " " + command.usage));
    if (command.cooldown) data.push(helpEmbed.addField("**Cooldown:**", command.cooldown + "second(s)"));

    data.push(message.channel.send(helpEmbed))

    message.channel.send(data.helpEmbed, {
      split: true
    });
  }
};
