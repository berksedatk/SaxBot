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
    message.guild.roles.map(r => {
      if (r.name === roleName) {
        roles.push(r)
      }
    })

    function createRoleEmbed() {
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

    if (roles.length > 1) {
      message.channel.send(`Theres more than one roles called ${roleName}, which one would you want to view?`)
      for (var i; i < roles.length; i++) {
        message.channel.send(`${i + 1} - Name: ${roles[i].name}, Position: ${roles[i].position}`)
      }
      message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 15000, errors:['time'] })
        .then(collected => {
          for (var e; e < roles.length; e++) {
            if (collected.content === e + 1) {
              const role = roles[e]
              createRoleEmbed(role)
            }
          }
        })
        .catch(error => {
          return message.channel.send(":x: | Timed out.")
        })
    } else if (roles.length === 1) {
      const role = roles[0]
      createRoleEmbed(role)
    } else if (!roles.length) {
      message.channel.send(":x: | Theres no such a role named like that. Be careful with the caps, maybe that's the issue.")
    }
  }
}
