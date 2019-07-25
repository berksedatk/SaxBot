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
    const roles = [];
    const foundRoles = [];
    message.guild.roles.map(r => {
      if (r.name === roleName) {
        roles.push(r)
      }
    })

    if (roles.length > 1) {
      message.channel.send(`Theres more than one roles called ${roleName}, which one would you want to view? \n\`Bigger value means higher position.\``)
      for (var i = 0; i < roles.length; i++) {
        foundRoles.push(`${i + 1} + Name: ${roles[i].name}, Position: ${roles[i].position}`)
      }
      message.channel.send(foundRoles)
      const filter = m => m.author.id === message.author.id;
      message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
       .then(collected => {
         for (var e = 0; e < roles.length; e++) {
           if (Number(collected.first().content) === e + 1) {
             const role = roles[e]
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
       })
       .catch(error => {
         return message.channel.send(":x: | Command cancelled.")
       });
    } else if (roles.length === 1) {
      const role = roles[0]
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
    } else if (!roles.length) {
      message.channel.send(":x: | Theres no such a role named like that. Be careful with the caps, maybe that's the issue.")
    }
  }
}
