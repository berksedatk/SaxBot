const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');

module.exports = {
  name: 'roleinfo',
  category: "Utility",
  description: 'Lists the information about a role.',
  usage: '[role name]',
  cooldown: 5,
  guildOnly: 'true',
  async execute(bot, message, args) {
    const roleName = message.content.slice(11)
    const role = bot.guilds.get(message.guild.id).roles.find('name', roleName)

    const roleEmbed = new Discord.RichEmbed()
    .setTitle(`**${role.name}**`)
    .setTimestamp()
    .setColor(role.color)
    .setFooter("Color and Permissions are in the format of snowflake. | Requested by " + message.author.username, message.author.avatarURL)
    .addField("Role Id", role.id)
    .addField("Seperated", role.hoist, true)
    .addField("Mentionable", role.mentionable, true)
    .addField("Position", role.position)
    .addField("Bot role", role.managed)
    .addField("Color code", role.color, true)
    .addField("Permissions", role.permissions, true)
    message.channel.send(roleEmbed)
  }
}
