const fs = require('fs')
const Discord = require('discord.js')
const config = require('../config.json');
const color = require('../data/colors.json');

module.exports = {
  name: 'guildinfo',
  category: "Utility",
  description: 'Lists the information about the guild you\'re in',
  aliases: ['serverinfo'],
  cooldown: 5,
  guildOnly: 'true',
  async execute(bot, message, args) {
    const guild = message.guild;
    let vccount = 0;
    let textcount = 0;
    guild.channels.map(c => {
      if (c.type === "text") {
        textcount += 1;
      } else if (c.type === "vc") {
        vccount += 1;
      }
    })

    let guildEmbed = new Discord.RichEmbed()
    .setTitle(guild.name)
    .setThumbnail(guild.iconURL)
    .addField("Guild Owner",`${guild.owner.username}#${guild.owner.discriminator}`)
    .addField("Guild Create Date", guild.createdAt)
    .addField("Member Count", guild.memberCount)
    .addField("Channel Count", `Text: ${textcount}, VC: ${vccount}`)
    .addField("Role Count", guild.roles.size)

    message.channel.send(guildEmbed)
  }
}
