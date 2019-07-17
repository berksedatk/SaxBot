const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');

module.exports = {
  name: 'kick',
  category: "Moderation",
  description: 'Kick someone',
  usage: '[user] [reason]',
  cooldown: 5,
  guildOnly: 'true',
  reqPermissions: ["KICK_MEMBERS"],
  async execute(bot, message, args) {
    let guild = message.guild;
    let reason = args.slice(1).join(' ');
    let member = message.mentions.users.first();

    if (reason.lenght < 1) return message.channel.send(":x: | You have to provide a reason for kick!");
    if (message.mentions.users.size < 1) return message.channel.send(":x: | You have to provide a user to use kick!");
    if (!message.guild.member(member).kickable) return message.channel.send(":x: | You can't kick this user. They are too powerful.");

    try {
      message.guild.member(member).kick(reason)
    } catch (e) {
      message.channel.send("An error occured: " + e);
    }

    let kickEmbed = new Discord.RichEmbed()
    .setColor("ORANGE")
    .setTimestamp()
    .setFooter("Requested by " + message.author.username, message.author.avatarURL)
    .setTitle("**Kicked!**")
    .addField("User", `${member.username}#${member.discriminator}(id: ${member.id})`)
    .addField("Reason", reason)
    .addField("Kicked by", message.author.username + "#" + message.author.discriminator)
    message.channel.send(kickEmbed)
  }
}
