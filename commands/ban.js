const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');

module.exports = {
  name: 'ban',
  category: "Moderation",
  description: 'Ban someone',
  usage: '[user] [reason]',
  cooldown: 5,
  guildOnly: 'true',
  reqPermissions: ["BAN_MEMBERS"],
  async execute(bot, message, args) {
    let guild = message.guild;
    let reason = args.slice(1).join(' ');
    let member = message.mentions.users.first();

    if (reason.lenght < 1) return message.channel.send(":x: | You have to provide a reason for ban!");
    if (message.mentions.users.size < 1) return message.channel.send(":x: | You have to provide a user to use ban!");
    if (!message.guild.member(member).bannable) return message.channel.send(":x: | You can't ban this user. They are too powerful.");

    try {
      message.guild.ban(member, reason)
    } catch (e) {
      message.channel.send("An error occured: " + e);
    }

    let banEmbed = new Discord.RichEmbed()
    .setColor("RED")
    .setTimestamp()
    .setFooter("Requested by " + message.author.username, message.author.avatarURL)
    .setTitle("**Banned!**")
    .addField("User", `${member.username}#${member.discriminator}(id: ${member.id})`)
    .addField("Reason", reason)
    .addField("Banned by", message.author.username + "#" + message.author.discriminator)
    message.channel.send(banEmbed)
  }
}
